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

  const userPlan = await query("SELECT * FROM user_plan WHERE email = $1", [
    url?.merchant_email,
  ]);

  let wallet = [];

  if (userPlan.rows[0]?.plan === "1") {
    wallet = await query("SELECT * FROM wallets WHERE email = $1", [
      url?.merchant_email,
    ]);
  } else {
    wallet = await query("SELECT * FROM wallets WHERE email = $1", [
      url?.merchant_email,
    ]);
  }

  // user wallet info

  const walletInfo = wallet.rows.map((wallet) =>
    wallet.wallet_provider?.toLowerCase()
  );

  const filteredPaymentMethods = paymentMethods.filter((method) =>
    walletInfo.includes(method.method_name?.toLowerCase())
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
    walletInfo: wallet.rows,
  };

  return NextResponse.json(data, { status: 200 });
}
