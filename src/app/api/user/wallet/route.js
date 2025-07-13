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
            type VARCHAR(255) NOT NULL,
            card_type VARCHAR(255),
            card_holder_name VARCHAR(255),
            card_number VARCHAR(255) ,
            expiry_date VARCHAR(255),
            billing_address VARCHAR(255),
            wallet_provider VARCHAR(255),
            wallet_number VARCHAR(255),
            wallet_account_type VARCHAR(255),
            net_bank_provider VARCHAR(255),
            net_bank_email_or_id VARCHAR(255),
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
    console.log("Wallet: ", wallet);
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

  console.log("Type: ", type);
  console.log("Email: ", email);
  console.log("Data: ", data);
  if (type === "card") {
    const { cardType, cardholderName, cardNumber, expiryDate, billingAddress } =
      data;
    // check the card type is exist with the email
    const checkCardTypeQuery = `
    SELECT * FROM wallets WHERE email = $1 AND card_type = $2
`;
    const checkCardType = await query(checkCardTypeQuery, [email, cardType]);
    if (checkCardType.rows.length > 0) {
      return NextResponse.json(
        { message: "Card type already exists" },
        { status: 400 }
      );
    }
    const insertCardQuery = `
        INSERT INTO wallets (email, type, card_type, card_holder_name, card_number, expiry_date, billing_address) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const result = await query(insertCardQuery, [
      email,
      type,
      cardType,
      cardholderName,
      cardNumber,
      expiryDate,
      billingAddress,
    ]);
    return NextResponse.json(
      { message: "Card info saved successfully" },
      { status: 200 },
      result
    );
  } else if (type === "mobile") {
    const { walletProvider, walletNumber, walletAccountType } = data;
    // check the wallet provider is exist with the email
    const checkWalletProviderQuery = `
    SELECT * FROM wallets WHERE email = $1 AND wallet_provider = $2
`;
    const checkWalletProvider = await query(checkWalletProviderQuery, [
      email,
      walletProvider,
    ]);
    if (checkWalletProvider.rows.length > 0) {
      return NextResponse.json(
        { message: "Wallet provider already exists" },
        { status: 400 }
      );
    }
    const insertMobileQuery = `
        INSERT INTO wallets (email, type, wallet_provider, wallet_number, wallet_account_type) VALUES ($1, $2, $3, $4, $5)
    `;
    const result = await query(insertMobileQuery, [
      email,
      type,
      walletProvider,
      walletNumber,
      walletAccountType,
    ]);
    return NextResponse.json(
      { message: "Mobile info saved successfully" },
      { status: 200 },
      result
    );
  } else if (type === "netbank") {
    const { netBankProvider, netBankEmailOrId } = data;
    // check the net bank provider is exist with the email
    const checkNetBankProviderQuery = `
    SELECT * FROM wallets WHERE email = $1 AND net_bank_provider = $2
`;
    const checkNetBankProvider = await query(checkNetBankProviderQuery, [
      email,
      netBankProvider,
    ]);
    if (checkNetBankProvider.rows.length > 0) {
      return NextResponse.json(
        { message: "Net bank provider already exists" },
        { status: 400 }
      );
    }
    const insertNetBankQuery = `
        INSERT INTO wallets (email, type, net_bank_provider, net_bank_email_or_id) VALUES ($1, $2, $3, $4)    
    `;
    const result = await query(insertNetBankQuery, [
      email,
      type,
      netBankProvider,
      netBankEmailOrId,
    ]);
    return NextResponse.json(
      { message: "Net bank info saved successfully" },
      { status: 200 },
      result
    );
  }
}

export async function PUT(req) {
  const { id, type, email, ...data } = await req.json();

  if (type === "card") {

    const { cardType, cardholderName, cardNumber, expiryDate, billingAddress } =
      data;
    
    const updateCardQuery = `
    UPDATE wallets SET card_type = $1, card_holder_name = $2, card_number = $3, expiry_date = $4, billing_address = $5 WHERE id = $6
`;
    const result = await query(updateCardQuery, [
      cardType,
      cardholderName,
      cardNumber,
      expiryDate,
      billingAddress,
      id,
    ]);
    return NextResponse.json(
      { message: "Card info updated successfully" },
      { status: 200 },
      result
    );
  } else if (type === "mobile") {
    const { walletProvider, walletNumber, walletAccountType } = data;
    const updateMobileQuery = `
    UPDATE wallets SET wallet_provider = $1, wallet_number = $2, wallet_account_type = $3 WHERE id = $4
`;
    const result = await query(updateMobileQuery, [
      walletProvider,
      walletNumber,
      walletAccountType,
      id,
    ]);
    return NextResponse.json(
      { message: "Mobile info updated successfully" },
      { status: 200 },
      result
    );
  } else if (type === "netbank") {
    const { netBankProvider, netBankEmailOrId } = data;
    const updateNetBankQuery = `
    UPDATE wallets SET net_bank_provider = $1, net_bank_email_or_id = $2 WHERE id = $3
`;
    const result = await query(updateNetBankQuery, [
      netBankProvider,
      netBankEmailOrId,
      id,
    ]);
    return NextResponse.json(
      { message: "Net bank info updated successfully" },
      { status: 200 },
      result
    );
  }
}
