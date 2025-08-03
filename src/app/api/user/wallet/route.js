import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    //   check the wallet table exist or not
    const checkWalletTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'wallets'
    );
  `;
    const tableExists = await query(checkWalletTableQuery);
    if (!tableExists.rows[0].exists) {
      const createWalletTableQuery = `
        CREATE TABLE wallets (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            wallet_provider VARCHAR(255) NOT NULL,
            merchant_number VARCHAR(255),
            api_key VARCHAR(255),
            api_secret VARCHAR(255),
            username VARCHAR(255),
            password VARCHAR(255),
            binance_id VARCHAR(255),
            binance_api_key VARCHAR(255),
            binance_api_secret VARCHAR(255),
            binance_qr_code VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
      await query(createWalletTableQuery);
    }
    const email = req.nextUrl.searchParams.get("email");
    const walletQuery = `
        SELECT * FROM wallets WHERE email = $1
    `;
    const wallet = await query(walletQuery, [email]);

    return NextResponse.json(wallet);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch wallet info" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { type, email, ...data } = await req.json();
  //  check already exist or not
  const checkExistQuery = `
    SELECT EXISTS (
      SELECT FROM wallets WHERE email = $1 AND wallet_provider = $2
    );
  `;
  const checkExist = await query(checkExistQuery, [
    email,
    data?.walletProvider,
  ]);
  if (checkExist.rows[0].exists) {
    return NextResponse.json(
      { message: "Wallet already exists" },
      { status: 400 }
    );
  }
  if (type === "mobile") {
    const result = await query(
      "INSERT INTO wallets (email, wallet_provider, merchant_number, api_key, api_secret, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        email,
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
      { status: 200 },
      result
    );
  } else if (type === "netbank") {
    const result = await query(
      "INSERT INTO wallets (email, wallet_provider, binance_id, binance_api_key, binance_api_secret, binance_qr_code) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        email,
        data?.walletProvider,
        data?.binanceId,
        data?.binanceApiKey,
        data?.binanceApiSecret,
        data?.binanceQrCode,
      ]
    );
    return NextResponse.json(
      { message: "Wallet info saved successfully" },
      { status: 200 },
      result
    );
  }
}

export async function PUT(req) {
  const { id, ...data } = await req.json();


  if (data?.type === "mobile") {
    const result = await query(
      "UPDATE wallets SET merchant_number = $1, api_key = $2, api_secret = $3, username = $4, password = $5 WHERE id = $6",
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
      "UPDATE wallets SET binance_id = $1, binance_api_key = $2, binance_api_secret = $3, binance_qr_code = $4 WHERE id = $5",
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
