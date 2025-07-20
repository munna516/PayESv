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
      `SELECT merchant_email, redirect_success_url, redirect_failed_url FROM transactions WHERE payment_id = $1`,
      [paymentId]
    );

    const walletInfo = await query(`SELECT * FROM wallets WHERE email = $1`, [
      userInfo.rows[0].merchant_email,
    ]);

    const redirect_success_url = userInfo.rows[0].redirect_success_url;
    const redirect_failed_url = userInfo.rows[0].redirect_failed_url;

    const wallet = walletInfo.rows[0];

    const BKASH_BASE_URL = wallet?.environment;
    const BKASH_APP_KEY = wallet?.api_key;

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
