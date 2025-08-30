import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  const headers = req.headers;
  const { id } = await req.json();
  const apiKey = headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing required headers" },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Missing required fields in query params" },
      { status: 400 }
    );
  }

  const merchant = await query("SELECT * FROM brands WHERE api_key = $1", [
    apiKey,
  ]);

  if (merchant.rowCount === 0) {
    return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
  }

  const result = await query("SELECT * FROM transactions WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    data: {
      id: result.rows[0].id,
      transaction_id: result.rows[0].transaction_id,
      order_id: result.rows[0].order_id,
      merchant_email: result.rows[0].merchant_email,
      amount: result.rows[0].amount,
      currency: result.rows[0].currency,
      status: result.rows[0].status,
      customer_name: result.rows[0].customer_name,
      customer_email: result.rows[0].customer_email,
      customer_phone: result.rows[0].customer_phone,
    },
  });
}
