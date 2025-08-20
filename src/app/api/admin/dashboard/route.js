import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  const dashboardData = await query(
    `WITH 
total_users AS (
  SELECT COUNT(*) AS count FROM users WHERE role = 'user'
),

payment_stats AS (
  SELECT
    COUNT(*) FILTER (WHERE status = 'Success') AS successful_transactions,
    COUNT(*) FILTER (WHERE status = 'Pending') AS unsuccessful_transactions,

    -- Successful transactions by currency
    COUNT(*) FILTER (WHERE status = 'Success' AND currency = 'USDT') AS successful_transactions_usd,
    COUNT(*) FILTER (WHERE status = 'Success' AND currency = 'BDT') AS successful_transactions_bdt,

    -- Unsuccessful transactions by currency
    COUNT(*) FILTER (WHERE status = 'Pending' AND currency = 'USDT') AS unsuccessful_transactions_usd,
    COUNT(*) FILTER (WHERE status = 'Pending' AND currency = 'BDT') AS unsuccessful_transactions_bdt,

    -- Earnings
    COALESCE(SUM(amount::numeric) FILTER (WHERE status = 'Success' AND currency = 'USDT'), 0) AS total_earning_usd,
    COALESCE(SUM(amount::numeric) FILTER (WHERE status = 'Success' AND currency = 'BDT'), 0) AS total_earning_bdt
  FROM payment_history
),

pending_tickets AS (
  SELECT COUNT(*) AS count FROM tickets WHERE status = 'Pending'
),

pending_invoices AS (
  SELECT COUNT(*) AS count FROM transactions WHERE status = 'pending'
)

SELECT
  tu.count AS total_users,
  ps.successful_transactions,
  ps.unsuccessful_transactions,

  ps.successful_transactions_usd,
  ps.successful_transactions_bdt,
  ps.unsuccessful_transactions_usd,
  ps.unsuccessful_transactions_bdt,

  ps.total_earning_usd,
  ps.total_earning_bdt,

  pt.count AS pending_tickets,
  pi.count AS pending_invoices
FROM total_users tu
CROSS JOIN payment_stats ps
CROSS JOIN pending_tickets pt
CROSS JOIN pending_invoices pi;
`
  );
  return NextResponse.json(dashboardData);
}
