import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const { brandName, brandUrl, email, status, brandLogo, webhookUrl } =
    await req.json();
  console.log(brandName, brandUrl, email, status, brandLogo, webhookUrl);
  const brandKey = "brk" + crypto.randomBytes(10).toString("hex");
  const apiKey = "api" + crypto.randomBytes(25).toString("hex");
  const apiSecret = "apis" + crypto.randomBytes(10).toString("hex");

  const checkBrandTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'brands'
      );
    `;
  const tableExists = await query(checkBrandTableQuery);

  if (!tableExists.rows[0].exists) {
    const createBrandTableQuery = `
        CREATE TABLE brands (
          brand_key VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          api_key VARCHAR(255) NOT NULL,
          api_secret VARCHAR(255) NOT NULL,
          brand_name VARCHAR(255) NOT NULL,
          brand_url VARCHAR(255) NOT NULL,
          brand_logo VARCHAR(255) NOT NULL,
          webhook_url VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await query(createBrandTableQuery);
  }

  const insertBrandQuery = `
      INSERT INTO brands (brand_key, email, api_key, api_secret, brand_name, brand_url, brand_logo, webhook_url, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

  const result = await query(insertBrandQuery, [
    brandKey,
    email,
    apiKey,
    apiSecret,
    brandName,
    brandUrl,
    brandLogo,
    webhookUrl,
    status,
  ]);

  return NextResponse.json(result);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const checkBrandTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'brands'
      );
    `;
  const tableExists = await query(checkBrandTableQuery);

  if (!tableExists.rows[0].exists) {
    const createBrandTableQuery = `
        CREATE TABLE brands (
          brand_key VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          api_key VARCHAR(255) NOT NULL,
          api_secret VARCHAR(255) NOT NULL,
          brand_name VARCHAR(255) NOT NULL,
          brand_url VARCHAR(255) NOT NULL,
          brand_logo VARCHAR(255) NOT NULL,
          webhook_url VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await query(createBrandTableQuery);
  }
  const brands = await query("SELECT * FROM brands WHERE email = $1", [email]);

  return NextResponse.json(brands);
}

export async function PUT(req) {
  const { brandKey, brandName, brandUrl, brandLogo, status, webhookUrl } =
    await req.json();

  console.log(brandKey, brandName, brandUrl, brandLogo, status, webhookUrl);

  const updateBrandQuery = `UPDATE brands SET brand_name = $1, brand_url = $2, brand_logo = $3, status = $4, webhook_url = $5 WHERE brand_key = $6`;
  const result = await query(updateBrandQuery, [
    brandName,
    brandUrl,
    brandLogo,
    status,
    webhookUrl,
    brandKey,
  ]);

  return NextResponse.json(result);
}
