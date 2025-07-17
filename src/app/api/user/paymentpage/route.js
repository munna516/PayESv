import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("Id");

  const info = await query("SELECT * FROM transactions WHERE id = $1", [id]);

  const url = info.rows[0];

  if (info.rows.length === 0) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }
  const redirect_url = url?.redirect_success_url;

  // const payment methods
  const p = await query("SELECT * FROM payment_methods");
  const paymentMethods = p.rows;

  // user wallet info
  const wallet = await query("SELECT * FROM wallets WHERE email = $1", [
    url?.merchant_email,
  ]);
  const walletInfo = wallet.rows[0];

  const filteredPaymentMethods = paymentMethods.filter(
    (method) =>
      method.method_name.toLowerCase() ===
      walletInfo?.wallet_provider?.toLowerCase()
  );

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

  const data = {
    brand: brand,
    paymentMethods: filteredPaymentMethods,
    info: info.rows[0],
    walletInfo: walletInfo,
  };

  return NextResponse.json(data, { status: 200 });
}
