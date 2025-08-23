import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  try {
    const wallet = await query(`SELECT * FROM ready_gateway_wallets`);
    return NextResponse.json(wallet.rows || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { type, ...data } = await req.json();
  //  check already exist or not
  const checkExistQuery = await query(
    "SELECT * FROM ready_gateway_wallets WHERE wallet_provider = $1",
    [data?.walletProvider]
  );
  if (checkExistQuery.rows.length > 0) {
    return NextResponse.json(
      { message: "Wallet already exists" },
      { status: 400 }
    );
  }
  if (type === "mobile") {
    const result = await query(
      "INSERT INTO ready_gateway_wallets (wallet_provider, merchant_number, api_key, api_secret, username, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        data?.walletProvider,
        data?.merchantNumber,
        data?.apiKey,
        data?.apiSecret,
        data?.username,
        data?.password,
      ]
    );
    return NextResponse.json(
      { message: "Wallet info saved successfully" },
      { status: 200 }
    );
  } else if (type === "netbank") {
    const result = await query(
      "INSERT INTO ready_gateway_wallets (wallet_provider, binance_id, binance_api_key, binance_api_secret, binance_qr_code) VALUES ($1, $2, $3, $4, $5)",
      [
        data?.walletProvider,
        data?.binanceId,
        data?.binanceApiKey,
        data?.binanceApiSecret,
        data?.binanceQrCode,
      ]
    );
    return NextResponse.json(
      { message: "Wallet info saved successfully" },
      { status: 200 }
    );
  }
}

export async function PUT(req) {
  const { id, ...data } = await req.json();

  if (data?.type === "mobile") {
    const result = await query(
      "UPDATE ready_gateway_wallets SET merchant_number = $1, api_key = $2, api_secret = $3, username = $4, password = $5 WHERE id = $6",
      [
        data?.merchantNumber,
        data?.apiKey,
        data?.apiSecret,
        data?.username,
        data?.password,
        id,
      ]
    );

    return NextResponse.json(
      { message: "Wallet info updated successfully" },
      { status: 200 },
      result
    );
  } else if (data?.type === "netbank") {
    const result = await query(
      "UPDATE ready_gateway_wallets SET binance_id = $1, binance_api_key = $2, binance_api_secret = $3, binance_qr_code = $4 WHERE id = $5",
      [
        data?.binanceId,
        data?.binanceApiKey,
        data?.binanceApiSecret,
        data?.binanceQrCode,
        id,
      ]
    );
    return NextResponse.json(
      { message: "Wallet info updated successfully" },
      { status: 200 },
      result
    );
  }
}
