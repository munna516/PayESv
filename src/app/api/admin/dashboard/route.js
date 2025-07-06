import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  const dashboardData = await query(
    `WITH 

all_months AS (
  SELECT 
    TO_CHAR(generate_series(
      DATE_TRUNC('year', CURRENT_DATE)::date,
      (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')::date,
      INTERVAL '1 month'
    ), 'YYYY-MM') AS month
),


total_users AS (
  SELECT COUNT(*) AS count FROM users WHERE role = 'user'
),
payment_stats AS (
  SELECT
    COUNT(*) FILTER (WHERE status = 'Success') AS successful_transactions,
    COUNT(*) FILTER (WHERE status = 'Pending') AS unsuccessful_transactions,
    COALESCE(SUM(amount::numeric) FILTER (WHERE status = 'Success' AND currency = 'USDT'), 0) AS total_earning_usdt,
    COALESCE(SUM(amount::numeric) FILTER (WHERE status = 'Success' AND currency = 'BDT'), 0) AS total_earning_bdt
  FROM payment_history
),
pending_tickets AS (
  SELECT COUNT(*) AS count FROM tickets WHERE status = 'Pending'
),


monthly_users AS (
  SELECT 
    am.month,
    COALESCE(COUNT(u.id), 0) AS user_count
  FROM all_months am
  LEFT JOIN users u ON TO_CHAR(u.created_at, 'YYYY-MM') = am.month AND u.role = 'user'
  GROUP BY am.month
  ORDER BY am.month
),


monthly_revenue AS (
  SELECT
    am.month,
    COALESCE(SUM(
      CASE
        WHEN ph.currency = 'USDT' THEN ph.amount::numeric * 124
        WHEN ph.currency = 'BDT' THEN ph.amount::numeric
        ELSE 0
      END
    ), 0) AS revenue
  FROM all_months am
  LEFT JOIN payment_history ph ON TO_CHAR(ph.created_at, 'YYYY-MM') = am.month AND ph.status = 'Success'
  GROUP BY am.month
  ORDER BY am.month
)


SELECT
  tu.count AS total_users,
  ps.successful_transactions,
  ps.unsuccessful_transactions,
  ps.total_earning_usdt,
  ps.total_earning_bdt,
  pt.count AS pending_tickets,
  (SELECT json_agg(json_build_object('month', mu.month, 'user_count', mu.user_count) ORDER BY mu.month) FROM monthly_users mu) AS monthly_users,
  (SELECT json_agg(json_build_object('month', mr.month, 'revenue', mr.revenue) ORDER BY mr.month) FROM monthly_revenue mr) AS monthly_revenue
FROM total_users tu
CROSS JOIN payment_stats ps
CROSS JOIN pending_tickets pt;`
  );
  return NextResponse.json(dashboardData);
}
