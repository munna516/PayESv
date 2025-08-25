import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const checkWithdrawalHistoryTableExist = `
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'withdrawal_history'
  );
`;
  const tableExists = await query(checkWithdrawalHistoryTableExist);
  if (!tableExists.rows[0].exists) {
    const createWithdrawalHistoryTableQuery = `
   CREATE TABLE withdrawal_history (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    withdraw_amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(50) NOT NULL,
    transactionId VARCHAR(255) NOT NULL,
    method JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
    await query(createWithdrawalHistoryTableQuery);
  }
  const deleteRejectedWithdrawalHistory = await query(
    `
    DELETE FROM withdrawal_history
    WHERE status = 'Rejected'
    AND created_at < NOW() - INTERVAL '3 day'
    AND email = $1
  `,
    [email]
  );
  const history = await query(
    `SELECT * FROM withdrawal_history WHERE email = $1`,
    [email]
  );
  return NextResponse.json(history.rows, { status: 200 });
}

export async function POST(request) {
  const { email, amount, withdraw_amount, currency, method } =
    await request.json();

  // Step 1: Find the method object
  const methods = await query(
    `SELECT elem AS method_obj 
       FROM withdrawal_methods, LATERAL jsonb_array_elements(methods) elem 
       WHERE email = $1 AND elem->>'id' = $2`,
    [email, method]
  );

  if (methods.rows.length === 0) {
    return NextResponse.json({ message: "Method not found" }, { status: 404 });
  }

  const methodObj = methods.rows[0].method_obj;

  // Step 2: Create transactionId
  const transactionId = crypto.randomUUID();

  // Step 3: Insert into withdrawal_history
  const result = await query(
    `INSERT INTO withdrawal_history (email, amount, withdraw_amount, currency, method, status, transactionId)
       VALUES ($1, $2, $3, $4, $5, 'Pending', $6)`,
    [email, amount, withdraw_amount, currency, methodObj, transactionId]
  );

  if (result.rowCount === 0) {
    return NextResponse.json(
      { message: "Failed to submit withdrawal request" },
      { status: 400 }
    );
  }

  // update available balance
  if (currency == "BDT") {
    const updateAvailableBalance = `UPDATE available_balance SET bdt_balance = bdt_balance - $1 WHERE email = $2`;
    await query(updateAvailableBalance, [amount, email]);
  } else {
    const updateAvailableBalance = `UPDATE available_balance SET usd_balance = usd_balance - $1 WHERE email = $2`;
    await query(updateAvailableBalance, [amount, email]);
  }
  return NextResponse.json(
    { message: "Withdrawal request submitted successfully" },
    { status: 200 }
  );
}
