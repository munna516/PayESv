import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  try {
    const brands = await query(`SELECT * FROM brands`);
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { brand_key, status } = await req.json();
    const res = await query(
      `UPDATE brands SET status = $1 WHERE brand_key = $2`,
      [status, brand_key]
    );
    return NextResponse.json({ message: "Brand status updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update brand status" },
      { status: 500 }
    );
  }
}
