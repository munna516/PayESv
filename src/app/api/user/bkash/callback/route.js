import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const queri = req.nextUrl.searchParams;
    const paymentId = queri.get("paymentID");
    let id;
    const result = await query(
      `SELECT token, expires_at FROM tokens ORDER BY id DESC LIMIT 1`
    );

    if (
      result.rows.length > 0 &&
      new Date(result.rows[0].expires_at) > new Date()
    ) {
      id = result.rows[0].token;
    } else {
      return NextResponse.json({ message: "Token expired" });
    }

    const userInfo = await query(
      `SELECT merchant_email, redirect_success_url, redirect_failed_url, currency, amount FROM transactions WHERE payment_id = $1`,
      [paymentId]
    );

    // select the user plan
    const userPlan = await query(`SELECT plan FROM users WHERE email = $1`, [
      userInfo.rows[0].merchant_email,
    ]);

    let walletInfo;
    if (userPlan.rows[0].plan == "1") {
      walletInfo = await query(`SELECT * FROM wallets WHERE email = $1`, [
        userInfo.rows[0].merchant_email,
      ]);
    } else if (userPlan.rows[0].plan == "2") {
      walletInfo = await query(`SELECT * FROM ready_gateway_wallets`);
    }

    console.log(walletInfo.rows[0]);

    const redirect_success_url = `${userInfo.rows[0].redirect_success_url}?paymentId=${paymentId}`;
    const redirect_failed_url = `${userInfo.rows[0].redirect_failed_url}?paymentId=${paymentId}`;

    const wallet = walletInfo?.rows?.find((w) => w.wallet_provider === "bKash");

    const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
    const BKASH_APP_KEY = wallet?.api_key;
    console.log(BKASH_APP_KEY);
    const payment = await fetch(
      `${BKASH_BASE_URL}/tokenized/checkout/execute`,
      {
        method: "POST",
        headers: {
          authorization: `${id}`,
          "x-app-key": BKASH_APP_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentID: paymentId,
        }),
      }
    );
    const data = await payment.json();
    if (data?.statusCode === "0000") {
      const updateTransaction = await query(
        `UPDATE transactions SET status = $1, transaction_id = $2, payment_method = $3 WHERE payment_id = $4`,
        ["success", data?.trxID, "bkash", paymentId]
      );

      const balance = await query(
        `SELECT bdt_balance FROM available_balance WHERE email = $1`,
        [userInfo.rows[0].merchant_email]
      );

      console.log("this is balance", balance.rows[0]);

      console.log("this is userInfo", userInfo.rows[0]);

      if (balance.rows.length > 0) {
        const updateBalance = await query(
          `UPDATE available_balance SET bdt_balance =$1 WHERE email = $2`,
          [
            balance.rows[0].bdt_balance + userInfo.rows[0].amount,
            userInfo.rows[0].merchant_email,
          ]
        );
      } else {
        const addBalance = await query(
          `INSERT INTO available_balance (email, bdt_balance,usd_balance) VALUES ($1, $2, $3)`,
          [userInfo.rows[0].merchant_email, userInfo.rows[0].amount, 0]
        );
      }
      return NextResponse.redirect(redirect_success_url);
    } else {
      const updateTransaction = await query(
        `UPDATE transactions SET status = $1, payment_method = $2 WHERE payment_id = $3`,
        ["failed", "bkash", paymentId]
      );
      return NextResponse.redirect(redirect_failed_url);
    }
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" });
  }
}
