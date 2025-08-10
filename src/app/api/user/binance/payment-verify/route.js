import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

export async function POST(req) {
  const { binanceWallet, info, binanceOrderId } = await req.json();
  try {
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
        message:
          "Payment not found",
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
