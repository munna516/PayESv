import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 }
      );
    }

    const data = await query(
      `SELECT * FROM transactions WHERE merchant_email = $1 AND (status = 'success' OR status = 'pending') ORDER BY created_at DESC`,
      [email]
    );
    
    if(data.rowCount > 0){
      return NextResponse.json(data.rows || []);
    }else{
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
