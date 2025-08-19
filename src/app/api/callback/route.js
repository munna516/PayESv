import { query } from "@/lib/db";
import { NextResponse } from "next/server";

const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
const BKASH_APP_KEY = process.env.BKASH_APP_KEY;

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
      // update payment history status to success
      const updatePaymentHistoryQuery = `
        UPDATE payment_history SET status = 'Success', transactionID = $1 WHERE paymentID = $2
      `;
      await query(updatePaymentHistoryQuery, [data?.trxID, paymentId]);

      // Step 2: Retrieve userID and plan from payment_history
      const getUserPlanQuery = `SELECT email, plan FROM payment_history WHERE paymentID = $1`;
      const result = await query(getUserPlanQuery, [paymentId]);

      if (result.rows.length > 0) {
        const { email, plan } = result.rows[0];

        const updateUserPlanQuery = `UPDATE user_plan SET status = 'Active' WHERE email = $1 AND id = (    SELECT id FROM user_plan WHERE email = $1 ORDER BY id DESC LIMIT 1);`;
        await query(updateUserPlanQuery, [email]);

        // update user plan
        const updateUserPlan = `UPDATE users SET plan = $1 WHERE email = $2`;
        await query(updateUserPlan, [plan, email]);
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/status?status=success`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/status?status=cancel`
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" });
  }
}
