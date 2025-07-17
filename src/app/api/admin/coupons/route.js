import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // check the coupons table exist or not
    const checkTableQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'coupons'
            );
        `;
    const tableExists = await query(checkTableQuery);
    if (!tableExists.rows[0].exists) {
     
      // create coupons table
      await query(`CREATE TABLE coupons (
                id SERIAL PRIMARY KEY,
                code VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL, 
                used_count INT DEFAULT 0,
                price DECIMAL(10, 2) NOT NULL,
                status VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
    
    }
    const coupons = await query("SELECT * FROM coupons");
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { code, type, price, status, description } = await req.json();


  const coupon = await query(
    "INSERT INTO coupons (code, type, price, status, description) VALUES ($1, $2, $3, $4, $5)",
    [code, type, price, status, description]
  );
  return NextResponse.json({ message: "Coupon created successfully" });
}


export async function DELETE(req) {
  const { id } = await req.json();
  const coupon = await query("DELETE FROM coupons WHERE id = $1", [id]);
  return NextResponse.json({ rowCount: coupon.rowCount });
}


export async function PUT(req) {
  const { id, code, type, price, status, description } = await req.json();
  const coupon = await query(
    "UPDATE coupons SET code = $1, type = $2, price = $3, status = $4, description = $5 WHERE id = $6",
    [code, type, price, status, description, id]
  );
  return NextResponse.json({ rowCount: coupon.rowCount });
}
