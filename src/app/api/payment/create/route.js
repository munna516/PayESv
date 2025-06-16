import { NextResponse } from "next/server";

const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
const BKASH_APP_KEY = process.env.BKASH_APP_KEY;
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET;
const BKASH_USERNAME = process.env.BKASH_USERNAME;
const BKASH_PASSWORD = process.env.BKASH_PASSWORD;

export async function POST(req) {
  const { email, amount, currency, plan } = await req.json();
  console.log(email, amount, currency, plan);
  const res = await fetch(`${BKASH_BASE_URL}`, {
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
  const id = data?.id_token;
  return NextResponse.json({ message: "Payment created", id });
}
