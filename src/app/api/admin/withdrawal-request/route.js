import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const request = await query(`SELECT * FROM withdrawal_history`);
    return NextResponse.json(request.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch withdrawal requests" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    // Update the withdrawal status
    const result = await query(
      "UPDATE withdrawal_history SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    const email = result.rows[0].email;
    const currency = result.rows[0].currency;
    const amount = result.rows[0].amount;

    if (status == "Rejected") {
      if (currency == "BDT") {
        const updateAvailableBalance = `UPDATE available_balance SET bdt_balance = bdt_balance + $1 WHERE email = $2`;
        await query(updateAvailableBalance, [amount, email]);
      } else {
        const updateAvailableBalance = `UPDATE available_balance SET usd_balance = usd_balance + $1 WHERE email = $2`;
        await query(updateAvailableBalance, [amount, email]);
      }
    }

    return NextResponse.json({
      message: "Status updated successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating withdrawal request:", error);
    return NextResponse.json(
      { error: "Failed to update withdrawal request" },
      { status: 500 }
    );
  }
}
