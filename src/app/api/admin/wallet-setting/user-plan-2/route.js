import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  const plan2_user = await query(`SELECT email FROM users WHERE plan = '2'`);
  return NextResponse.json(plan2_user.rows, { status: 200 });
}
