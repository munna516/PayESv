import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  try {
    // First, get all users with plan = 2
    const plan2Users = await query(`SELECT email FROM users WHERE plan = '2'`);

    if (!plan2Users.rows || plan2Users.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Extract emails from the users
    const emails = plan2Users.rows.map((user) => user.email);

    // Create a parameterized query for the wallets table
    const placeholders = emails.map((_, index) => `$${index + 1}`).join(",");
    const walletQuery = `
      SELECT * FROM wallets 
      WHERE email IN (${placeholders})
      ORDER BY email, wallet_provider
    `;

    // Get wallet data for these users
    const walletData = await query(walletQuery, emails);

    return NextResponse.json(walletData.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}
