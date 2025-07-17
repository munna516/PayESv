import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userPlans = await query(
      `SELECT * FROM user_plan where status = 'Active'`
    );
   
    return NextResponse.json(userPlans);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user plans" },
      { status: 500 }
    );
  }
}
