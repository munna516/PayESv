// import { query } from "@/lib/db";
// import { NextResponse } from "next/server";
// import crypto from "crypto";

// async function notifyMerchantWebhook({
//   webhookUrl,
//   apiSecret,
//   orderId,
//   status,
//   txnId,
//   amount,
//   currency,
// }) {
//   console.log(webhookUrl, apiSecret, orderId, status, txnId, amount, currency);
//   const body = JSON.stringify({ orderId, status, txnId, amount, currency });
//   console.log(body);
//   const sig = crypto.createHmac("sha256", apiSecret).update(body).digest("hex");
//   await fetch(webhookUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-signature": sig,
//     },
//     body,
//   });
// }

// export async function GET(req) {
//   try {
//     const queri = req.nextUrl.searchParams;
//     const paymentId = queri.get("paymentID");
//     let id;
//     const result = await query(
//       `SELECT token, expires_at FROM tokens ORDER BY id DESC LIMIT 1`
//     );

//     if (
//       result.rows.length > 0 &&
//       new Date(result.rows[0].expires_at) > new Date()
//     ) {
//       id = result.rows[0].token;
//     } else {
//       return NextResponse.json({ message: "Token expired" });
//     }

//     const userInfo = await query(
//       `SELECT merchant_email, redirect_success_url, redirect_failed_url, currency, amount FROM transactions WHERE payment_id = $1`,
//       [paymentId]
//     );

//     // select the user plan
//     const userPlan = await query(`SELECT plan FROM users WHERE email = $1`, [
//       userInfo.rows[0].merchant_email,
//     ]);

//     let walletInfo;
//     if (userPlan.rows[0].plan == "1") {
//       walletInfo = await query(`SELECT * FROM wallets WHERE email = $1`, [
//         userInfo.rows[0].merchant_email,
//       ]);
//     } else if (userPlan.rows[0].plan == "2") {
//       walletInfo = await query(`SELECT * FROM ready_gateway_wallets`);
//     }

//     const redirect_success_url = userInfo.rows[0].redirect_success_url;
//     const redirect_failed_url = userInfo.rows[0].redirect_failed_url;

//     const wallet = walletInfo?.rows?.find((w) => w.wallet_provider === "bKash");

//     const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
//     const BKASH_APP_KEY = wallet?.api_key;

//     const payment = await fetch(
//       `${BKASH_BASE_URL}/tokenized/checkout/execute`,
//       {
//         method: "POST",
//         headers: {
//           authorization: `${id}`,
//           "x-app-key": BKASH_APP_KEY,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           paymentID: paymentId,
//         }),
//       }
//     );
//     const data = await payment.json();

//     const brandInfo = await query(`SELECT * FROM brands WHERE email = $1`, [
//       userInfo.rows[0].merchant_email,
//     ]);

//     const transactionInfo = await query(
//       `SELECT * FROM transactions WHERE payment_id = $1`,
//       [paymentId]
//     );
//     if (data?.statusCode === "0000") {
//       const updateTransaction = await query(
//         `UPDATE transactions SET status = $1, transaction_id = $2, payment_method = $3 WHERE payment_id = $4`,
//         ["success", data?.trxID, "bkash", paymentId]
//       );

//       const balance = await query(
//         `SELECT bdt_balance FROM available_balance WHERE email = $1`,
//         [userInfo.rows[0].merchant_email]
//       );

//       if (balance.rows.length > 0) {
//         const updateBalance = await query(
//           `UPDATE available_balance SET bdt_balance =$1 WHERE email = $2`,
//           [
//             balance.rows[0].bdt_balance + userInfo.rows[0].amount,
//             userInfo.rows[0].merchant_email,
//           ]
//         );
//       } else {
//         const addBalance = await query(
//           `INSERT INTO available_balance (email, bdt_balance,usd_balance) VALUES ($1, $2, $3)`,
//           [userInfo.rows[0].merchant_email, userInfo.rows[0].amount, 0]
//         );
//       }

//       await notifyMerchantWebhook({
//         webhookUrl: brandInfo.rows[0].webhook_url,
//         apiSecret: brandInfo.rows[0].api_secret,
//         orderId: transactionInfo.rows[0].order_id,
//         status: "success",
//         txnId: transactionInfo.rows[0].transaction_id,
//         amount: transactionInfo.rows[0].amount,
//         currency: transactionInfo.rows[0].currency,
//       });

//       return NextResponse.redirect(redirect_success_url);
//     } else {
//       const updateTransaction = await query(
//         `UPDATE transactions SET status = $1, payment_method = $2 WHERE payment_id = $3`,
//         ["failed", "bkash", paymentId]
//       );

//       await notifyMerchantWebhook({
//         webhookUrl: brandInfo.rows[0].webhook_url,
//         apiSecret: brandInfo.rows[0].api_secret,
//         orderId: transactionInfo.rows[0].order_id,
//         status: "failed",
//         txnId: transactionInfo.rows[0].transaction_id,
//         amount: transactionInfo.rows[0].amount,
//         currency: transactionInfo.rows[0].currency,
//       });
//       return NextResponse.redirect(redirect_failed_url);
//     }
//   } catch (error) {
//     return NextResponse.json({ message: "Something went wrong" });
//   }
// }


import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Optional: ensure Node runtime (good for crypto/fetch)
export const runtime = "nodejs";

function toAmountString(v) {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

async function notifyMerchantWebhook({
  webhookUrl,
  apiSecret,
  payload,            // { orderId, status, txnId?, amount?, currency? }
  timeoutMs = 8000,
  maxRetries = 3,
}) {
  if (!webhookUrl || !apiSecret) return; // nothing to do

  const body = JSON.stringify(payload); // SIGN EXACTLY WHAT YOU SEND
  const sig = crypto.createHmac("sha256", apiSecret).update(body).digest("hex");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-signature": sig,
        },
        body,
        signal: controller.signal,
      });
      clearTimeout(t);

      if (res.ok) return; // done
      // retry on 5xx only
      if (res.status >= 500 && attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 400 * attempt));
        continue;
      }
      const txt = await res.text().catch(() => "");
      console.error("Merchant webhook error:", res.status, txt);
      return;
    } catch (err) {
      clearTimeout(t);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 400 * attempt));
        continue;
      }
      console.error("Merchant webhook network error:", err);
      return;
    }
  }
}

export async function GET(req) {
  try {
    const searchParams = req.nextUrl?.searchParams ?? new URL(req.url).searchParams;
    const paymentId = searchParams.get("paymentID");
    if (!paymentId) {
      return NextResponse.json({ message: "Missing paymentID" }, { status: 400 });
    }

    // latest valid bKash token
    const tokenRes = await query(
      `SELECT token, expires_at FROM tokens ORDER BY id DESC LIMIT 1`
    );
    if (
      tokenRes.rows.length === 0 ||
      new Date(tokenRes.rows[0].expires_at) <= new Date()
    ) {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }
    const authToken = tokenRes.rows[0].token;

    // transaction + merchant
    const trx = await query(
      `SELECT merchant_email, redirect_success_url, redirect_failed_url, currency, amount, order_id
       FROM transactions WHERE payment_id = $1`,
      [paymentId]
    );
    if (trx.rows.length === 0) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }
    const t = trx.rows[0];

    // wallet by plan
    const planRes = await query(`SELECT plan FROM users WHERE email = $1`, [t.merchant_email]);
    const plan = planRes.rows[0]?.plan;

    let walletInfo;
    if (plan == "1") {
      walletInfo = await query(`SELECT * FROM wallets WHERE email = $1`, [t.merchant_email]);
    } else if (plan == "2") {
      walletInfo = await query(`SELECT * FROM ready_gateway_wallets`);
    } else {
      console.error("Unknown plan", t.merchant_email, plan);
      return NextResponse.json({ message: "Invalid merchant plan" }, { status: 400 });
    }

    const wallet = walletInfo?.rows?.find(w => w.wallet_provider === "bKash");
    if (!wallet) {
      return NextResponse.json({ message: "bKash wallet missing" }, { status: 400 });
    }

    const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
    const BKASH_APP_KEY = wallet.api_key;

    // bKash execute
    const bkashRes = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/execute`, {
      method: "POST",
      headers: {
        authorization: `${authToken}`,
        "x-app-key": BKASH_APP_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentID: paymentId }),
    });

    let data = null;
    try {
      data = await bkashRes.json();
    } catch {
      console.error("bKash execute non-JSON:", await bkashRes.text().catch(() => ""));
    }

    // brand creds for webhook
    const brandInfoRes = await query(
      `SELECT webhook_url, api_secret FROM brands WHERE email = $1`,
      [t.merchant_email]
    );
    const brand = brandInfoRes.rows[0] || {};

    const trxFullRes = await query(`SELECT * FROM transactions WHERE payment_id = $1`, [paymentId]);
    const trxFull = trxFullRes.rows[0] || {};

    const payload = {
      orderId: String(trxFull.order_id ?? t.order_id),
      status: data?.statusCode === "0000" ? "success" : "failed",
      txnId: String(trxFull.transaction_id ?? data?.trxID ?? ""),
      amount: toAmountString(trxFull.amount ?? t.amount),
      currency: String((trxFull.currency ?? t.currency) || "").toUpperCase(),
    };

    if (data?.statusCode === "0000") {
      // success → update DB
      await query(
        `UPDATE transactions SET status = $1, transaction_id = $2, payment_method = $3 WHERE payment_id = $4`,
        ["success", data?.trxID ?? trxFull.transaction_id, "bkash", paymentId]
      );

      // credit balance (BDT shown; add USD branch if needed)
      const bal = await query(`SELECT bdt_balance FROM available_balance WHERE email = $1`, [t.merchant_email]);
      if (bal.rows.length > 0) {
        await query(
          `UPDATE available_balance SET bdt_balance = $1 WHERE email = $2`,
          [Number(bal.rows[0].bdt_balance) + Number(t.amount), t.merchant_email]
        );
      } else {
        await query(
          `INSERT INTO available_balance (email, bdt_balance, usd_balance) VALUES ($1, $2, $3)`,
          [t.merchant_email, t.amount, 0]
        );
      }

      // server-to-server notify
      await notifyMerchantWebhook({
        webhookUrl: brand.webhook_url,
        apiSecret: brand.api_secret,
        payload,
      });

      // redirect shopper
      const url = new URL(t.redirect_success_url);
      url.searchParams.set("paymentId", paymentId);
      return NextResponse.redirect(url.toString());
    } else {
      // failed
      await query(
        `UPDATE transactions SET status = $1, payment_method = $2 WHERE payment_id = $3`,
        ["failed", "bkash", paymentId]
      );

      await notifyMerchantWebhook({
        webhookUrl: brand.webhook_url,
        apiSecret: brand.api_secret,
        payload,
      });

      const url = new URL(t.redirect_failed_url);
      url.searchParams.set("paymentId", paymentId);
      return NextResponse.redirect(url.toString());
    }
  } catch (error) {
    console.error("bKash execute handler error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
