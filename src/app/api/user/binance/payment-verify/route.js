import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

export async function POST(req) {
  const { binanceWallet, info, binanceOrderId } = await req.json();
  try {
    console.log("this is binanceWallet", binanceWallet);
    console.log("this is info", info);
    console.log("this is binanceOrderId", binanceOrderId);
    // Check PAYMENT HISTORY (not deposits)
    const queryParams = new URLSearchParams({
      startTime: String(Date.now() - 15 * 60 * 1000), // Last 15 minute
      endTime: String(Date.now()),
      timestamp: String(Date.now()),
    });
    const API_KEY = binanceWallet?.binance_api_key;
    const API_SECRET = binanceWallet?.binance_api_secret;

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
      (p) => p.orderId == binanceOrderId && p.amount == info?.amount
    );

    if (!matchingPayment) {
      return NextResponse.json({
        verified: false,
        message: "Payment not found",
      });
    }

    const alreadySuccess = await query(
      "SELECT * FROM transactions WHERE id = $1 AND status = 'success'",
      [info?.id]
    );

    if (alreadySuccess.rowCount > 0) {
      return NextResponse.json({
        verified: true,
        message: "Payment already verified with this OrderId",
      });
    }

    const updateTransaction = await query(
      "UPDATE transactions SET status = 'success', payment_id = $1, transaction_id = $2, payment_method = 'Binance' WHERE id = $3",
      [binanceOrderId, matchingPayment?.transactionId, info?.id]
    );

    const userPlan = await query("SELECT * FROM users WHERE email = $1", [
      info?.merchant_email,
    ]);
    if (userPlan.rows[0].plan == "2") {
      const userExist = await query(
        "SELECT * FROM available_balance WHERE email = $1",
        [info?.merchant_email]
      );
      if (userExist.rows.length > 0) {
        const updateBalance = await query(
          "UPDATE available_balance SET usd_balance = $1 WHERE email = $2",
          [info?.amount + userExist.rows[0].usd_balance, info?.merchant_email]
        );
      } else {
        const addBalance = await query(
          "INSERT INTO available_balance (email, usd_balance, bdt_balance) VALUES ($1, $2, $3)",
          [info?.merchant_email, info?.amount, 0]
        );
      }
    }
    if (updateTransaction.rowCount > 0) {
      return NextResponse.json({
        verified: true,
        message: "Payment verified successfully",
        redirect_success_url: info?.redirect_success_url,
        redirect_failed_url: info?.redirect_failed_url,
      });
    } else {
      return NextResponse.json({
        verified: false,
        message: "Payment verification failed",
        redirect_failed_url: info?.redirect_failed_url,
      });
    }
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
