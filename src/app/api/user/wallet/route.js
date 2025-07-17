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
            merchant_number VARCHAR(255) NOT NULL,
            api_key VARCHAR(255) NOT NULL,
            api_secret VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            environment VARCHAR(255) NOT NULL,
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
  const result = await query(
    "INSERT INTO wallets (email, wallet_provider, merchant_number, api_key, api_secret, username, password, environment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      email,
      data?.walletProvider,
      data?.merchantNumber,
      data?.apiKey,
      data?.apiSecret,
      data?.username,
      data?.password,
      data?.environment,
    ]
  );
  return NextResponse.json(
    { message: "Wallet info saved successfully" },
    { status: 200 },
    result
  );
}

export async function PUT(req) {
  const { id, ...data } = await req.json();
  const result = await query(
    "UPDATE wallets SET merchant_number = $1, api_key = $2, api_secret = $3, username = $4, password = $5, environment = $6 WHERE id = $7",
    [
      data?.merchantNumber,
      data?.apiKey,
      data?.apiSecret,
      data?.username,
      data?.password,
      data?.environment,
      id,
    ]
  );

  return NextResponse.json(
    { message: "Wallet info updated successfully" },
    { status: 200 },
    result
  );
}
