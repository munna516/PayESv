import { NextResponse } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { query } from "@/lib/db";

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;

export async function POST(req) {
  const { orderId, amount, currency, plan, email, yearly, websiteQuantity } =
    await req.json();

  try {
    // Check PAYMENT HISTORY (not deposits)
    const queryParams = new URLSearchParams({
      startTime: String(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      endTime: String(Date.now()),
      timestamp: String(Date.now()),
    });

    const signature = crypto
      .createHmac("sha256", API_SECRET)
      .update(queryParams.toString())
      .digest("hex");

    const url = `https://api.binance.com/sapi/v1/pay/transactions?${queryParams.toString()}&signature=${signature}`;

    const response = await fetch(url, {
      headers: { "X-MBX-APIKEY": API_KEY },
    });

    const payments = await response.json();

    const matchingPayment = payments?.data?.find(
      (p) => p.orderId === orderId && p.currency === currency
    );

    if (!matchingPayment) {
      return NextResponse.json({
        verified: false,
        message:
          "Payment not found. Please try again or contact support for manual verification.",
      });
    }

    const merchantInvoiceNumber = "Inv" + uuidv4().substring(0, 10);

    // save payment to
    const insertPaymentHistoryQuery = `
      INSERT INTO payment_history (email,paymentID,merchantInvoiceNumber,transactionID, status, amount, currency, plan, yearly) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const result = await query(insertPaymentHistoryQuery, [
      email,
      orderId,
      merchantInvoiceNumber,
      matchingPayment.transactionId,
      "Success",
      amount,
      currency,
      plan,
      yearly,
    ]);

    let expires_at;
    if (plan === 1 && yearly) {
      expires_at = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      );
    } else if (plan === 1 && !yearly) {
      expires_at = new Date(new Date().setMonth(new Date().getMonth() + 1));
    } else if (plan === 2) {
      expires_at = new Date(
        new Date().setFullYear(new Date().getFullYear() + 100)
      );
    }

    // insert user plan
    const insertUserPlanQuery = `
    INSERT INTO user_plan (email, websiteQuantity, plan, yearly, status, expires_at) VALUES ($1, $2, $3, $4, $5, $6)
  `;
    const userPlanResult = await query(insertUserPlanQuery, [
      email,
      websiteQuantity,
      plan,
      yearly,
      "Active",
      expires_at,
    ]);

    // update user plan
    const updateUserPlanQuery = `
      UPDATE users SET plan = $1 WHERE email = $2
    `;
    const updateUserPlanResult = await query(updateUserPlanQuery, [
      plan,
      email,
    ]);
    return NextResponse.json({
      verified: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        verified: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
