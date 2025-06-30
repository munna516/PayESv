import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const { brandName, brandUrl, email, status, brandLogo } = await req.json();
  const brandKey = "brk" + crypto.randomBytes(10).toString("hex");

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
          brand_name VARCHAR(255) NOT NULL,
          brand_url VARCHAR(255) NOT NULL,
          brand_logo VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await query(createBrandTableQuery);
  }

  const insertBrandQuery = `
      INSERT INTO brands (brand_key, email, brand_name, brand_url, brand_logo, status) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

  const result = await query(insertBrandQuery, [
    brandKey,
    email,
    brandName,
    brandUrl,
    brandLogo,
    status,
  ]);

  return NextResponse.json(result);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  console.log("this is the email", email);
  const brands = await query("SELECT * FROM brands WHERE email = $1", [email]);

  return NextResponse.json(brands);
}

export async function PUT(req) {
  const { brandKey, brandName, brandUrl, brandLogo, status } = await req.json();
  console.log("this is the brandKey", brandKey);
  console.log("this is the brandName", brandName);
  console.log("this is the brandUrl", brandUrl);
  console.log("this is the brandLogo", brandLogo);
  console.log("this is the status", status);

  const updateBrandQuery = `UPDATE brands SET brand_name = $1, brand_url = $2, brand_logo = $3, status = $4 WHERE brand_key = $5`;
  const result = await query(updateBrandQuery, [
    brandName,
    brandUrl,
    brandLogo,
    status,
    brandKey,
  ]);
  console.log("this is the result", result);
  return NextResponse.json(result);
}
