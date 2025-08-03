import { query } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req) {
  const transactions = await query("SELECT * FROM payment_history");
  return NextResponse.json(transactions?.rows || []);
}
