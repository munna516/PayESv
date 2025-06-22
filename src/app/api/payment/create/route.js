import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
const BKASH_APP_KEY = process.env.BKASH_APP_KEY;
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET;
const BKASH_USERNAME = process.env.BKASH_USERNAME;
const BKASH_PASSWORD = process.env.BKASH_PASSWORD;

const getToken = async () => {
  // 1. Check if tokens table exists
  const checkTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tokens'
    );
  `;
  const tableExists = await query(checkTableQuery);

  if (!tableExists.rows[0].exists) {
    // 2. Create tokens table
    const createTableQuery = `
      CREATE TABLE tokens (
        id SERIAL PRIMARY KEY,
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour'
      );
    `;
    await query(createTableQuery);
  }

  // 3. Check for existing valid token
  const result = await query(
    `SELECT token, expires_at FROM tokens ORDER BY id DESC LIMIT 1`
  );

  if (
    result.rows.length > 0 &&
    new Date(result.rows[0].expires_at) > new Date()
  ) {
    return result.rows[0].token;
  }

  // 4. Token expired or not found → generate new one
  const res = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      username: BKASH_USERNAME,
      password: BKASH_PASSWORD,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET,
    }),
  });

  const data = await res.json();
  const idToken = data?.id_token;

  if (!idToken) {
    throw new Error("Failed to retrieve bKash token");
  }

  // 5. Store the new token securely (use parameterized query to prevent SQL injection)
  await query(
    `INSERT INTO tokens (token, created_at, expires_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 hour')`,
    [idToken]
  );

  return idToken;
};

export async function POST(req) {
  const { email, amount, currency, plan, yearly } = await req.json();
  console.log(email, amount, currency, plan, yearly);

  const id = await getToken();
  const payment = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      authorization: `${id}`,
      "x-app-key": BKASH_APP_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "0011",
      currency: "BDT",
      intent: "sale",
      amount: amount,
      email: email,
      plan: plan,
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback`,
      merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 10),
      payerReference: email,
    }),
  });
  const data = await payment.json();

  // Check user payment history table exists or not

  const checkTableQuery = `
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'payment_history'
  );
  `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
        CREATE TABLE payment_history (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          paymentID VARCHAR(255) NOT NULL,
          merchantInvoiceNumber VARCHAR(255) NOT NULL,
          transactionID VARCHAR(255),
          status VARCHAR(255) NOT NULL,
          amount VARCHAR(255) NOT NULL,
          currency VARCHAR(255) NOT NULL,
          plan VARCHAR(255) NOT NULL,
          yearly BOOLEAN NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
    await query(createTableQuery);
  }

  const status = "Pending";

  // Insert payment history
  const insertPaymentHistoryQuery = `
      INSERT INTO payment_history (email,paymentID,merchantInvoiceNumber, status, amount, currency, plan, yearly) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
  const result = await query(insertPaymentHistoryQuery, [
    email,
    data.paymentID,
    data.merchantInvoiceNumber,
    status,
    data.amount,
    data.currency,
    plan,
    yearly,
  ]);

  return NextResponse.json({ message: "Payment created", data });
}
