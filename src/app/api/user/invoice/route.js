import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  // check invoices table exists or not
  const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'invoices'
      );
    `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
        CREATE TABLE invoices (
          id SERIAL PRIMARY KEY,
          invoice_id VARCHAR(255) NOT NULL,
          brand VARCHAR(255) NOT NULL,
          merchant_email VARCHAR(255) NOT NULL,
          fullName VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          amount VARCHAR(255) NOT NULL,
          currency VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          paymentLink VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
    await query(createTableQuery);
  }
  const result = await query(
    "SELECT * FROM invoices WHERE merchant_email = $1",
    [email]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const {
    brand,
    fullName,
    merchant_email,
    customer_email,
    phone,
    amount,
    currency,
    paymentLink,
  } = await req.json();
  // check invoices table exists or not
  const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'invoices'
      );
    `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
        CREATE TABLE invoices (
          id SERIAL PRIMARY KEY,
          invoice_id VARCHAR(255) NOT NULL,
          brand VARCHAR(255) NOT NULL,
          merchant_email VARCHAR(255) NOT NULL,
          fullName VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          amount VARCHAR(255) NOT NULL,
          currency VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          paymentLink VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
    await query(createTableQuery);
  }
  const invoice_id = uuidv4();
  const status = "Pending";
  const result = await query(
    "INSERT INTO invoices (invoice_id, brand, merchant_email, fullName, customer_email, phone, amount, currency, status, paymentLink) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [
      invoice_id,
      brand,
      merchant_email,
      fullName,
      customer_email,
      phone,
      amount,
      currency,
      status,
      paymentLink,
    ]
  );
  return NextResponse.json(result);
}
