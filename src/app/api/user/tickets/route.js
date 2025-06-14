import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const POST = async (request) => {
  const {
    email,
    category,
    paymentMethod,
    transactionId,
    websiteLink,
    description,
  } = await request.json();

  // check tickets table exists
  const checkTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tickets'
    );
    `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        paymentMethod VARCHAR(255), 
        transactionId VARCHAR(255),
        websiteLink VARCHAR(255),
        description TEXT NOT NULL,
        status VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) 
    `;
    await query(createTableQuery);
  }
  const status = "Pending";
  const result = await query(
    "INSERT INTO tickets (email, category, paymentMethod, transactionId, websiteLink, description, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      email,
      category,
      paymentMethod,
      transactionId,
      websiteLink,
      description,
      status,
    ]
  );
  return NextResponse.json(result);
};

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  // check tickets table exists
  const checkTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'tickets'
    );
    `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        paymentMethod VARCHAR(255),
        transactionId VARCHAR(255),
        websiteLink VARCHAR(255),
        description TEXT NOT NULL,
        status VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await query(createTableQuery);
  }
  const result = await query("SELECT * FROM tickets WHERE email = $1", [email]);
  return NextResponse.json(result);
};
