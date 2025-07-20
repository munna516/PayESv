import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const transactions = await query(
      `SELECT * FROM transactions WHERE merchant_email = $1`,
      [email]
    );
    return NextResponse.json(transactions?.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
