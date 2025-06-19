import { NextResponse } from "next/server";

const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
const BKASH_APP_KEY = process.env.BKASH_APP_KEY;
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET;
const BKASH_USERNAME = process.env.BKASH_USERNAME;
const BKASH_PASSWORD = process.env.BKASH_PASSWORD;

const getToken = async () => {
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
  const id = data?.id_token;
  return id;
};

export async function POST(req) {
  const { email, amount, currency, plan } = await req.json();
  console.log(email, amount, currency, plan);
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
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/status`,
      amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber:
        "Inv" + Math.random().toString(36).substring(2, 15),
      payerReference: email,
    }),
  });
  const data = await payment.json();
  console.log(data);
  return NextResponse.json({ message: "Payment created", data });
}
