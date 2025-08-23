import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const user = await query("SELECT * FROM available_balance WHERE email = $1", [
    email,
  ]);
  if (user.rows.length == 0) {
    return NextResponse.json({
      bdt_balance: 0,
      usd_balance: 0,
      methods: [],
    });
  }

  const methods = await query(
    "SELECT * FROM withdrawal_methods where email = $1",
    [email]
  );

  if (methods.rows.length == 0) {
    return NextResponse.json({
      bdt_balance: user.rows[0].bdt_balance,
      usd_balance: user.rows[0].usd_balance,
      methods: [],
    });
  }

  return NextResponse.json({
    bdt_balance: user.rows[0].bdt_balance,
    usd_balance: user.rows[0].usd_balance,
    methods: methods.rows[0].methods,
  });
}
