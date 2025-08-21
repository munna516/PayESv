import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const { paymentId } = await req.json();

    const result = await query(
      "SELECT * FROM transactions WHERE payment_id = $1",
      [paymentId]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    const payment = result.rows[0];
    const orderId = payment.order_id;
    const status = payment.status;

    return NextResponse.json({ orderId, status });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
