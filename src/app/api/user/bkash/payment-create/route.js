import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const BKASH_BASE_URL = process.env.BKASH_BASE_URL;

const getToken = async (username, password, app_key, app_secret) => {
  const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
  const BKASH_APP_KEY = app_key;
  const BKASH_APP_SECRET = app_secret;
  const BKASH_USERNAME = username;
  const BKASH_PASSWORD = password;

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
  const {
    email,
    amount,
    currency,
    apiKey,
    apiSecret,
    username,
    password,
    marchant_number,
    p_id,
  } = await req.json();

  const id = await getToken(username, password, apiKey, apiSecret);

  const payment = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      authorization: `${id}`,
      "x-app-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "0011",
      currency: currency,
      intent: "sale",
      amount: amount,
      email: email,
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/user/bkash/callback`,
      merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 10),
      payerReference: email,
    }),
  });
  const data = await payment.json();

  const updateTransaction = await query(
    `UPDATE transactions SET payment_id = $1 WHERE id = $2`,
    [data?.paymentID, p_id]
  );
  return NextResponse.json(data?.bkashURL, { status: 200 });
}
