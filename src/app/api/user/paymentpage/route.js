import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transactionId");

  const url = await query(
    "SELECT redirect_url FROM transactions WHERE transaction_id = $1",
    [transactionId]
  );
  if (url.rows.length === 0) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }
  const redirect_url = url.rows[0].redirect_url;
  // ✅ Extract base URL
  const urlObj = new URL(redirect_url);
  const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

  const brands = await query("SELECT * FROM brands WHERE brand_url = $1", [
    baseUrl,
  ]);

  if (brands.rows.length === 0) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }
  const brand = brands.rows[0];

  return NextResponse.json(brand, { status: 200 });
}
