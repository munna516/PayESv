import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const deletePendingTransactions = await query(
    `
    DELETE FROM transactions
    WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '1 day'
    AND merchant_email = $1
  `,
    [email]
  );

  // User Info
  // Dates
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const thisYear = new Date();
  thisYear.setFullYear(thisYear.getFullYear() - 1);

  const lifetime = new Date();
  lifetime.setFullYear(lifetime.getFullYear() - 100);

  // Queries
  const [
    todayRes,
    yesterdayRes,
    last7Res,
    last30Res,
    lastMonthRes,
    thisYearRes,
    lifetimeRes,
  ] = await Promise.all([
    query(
      `SELECT * FROM transactions 
     WHERE merchant_email = $1 
     AND created_at >= $2 
     AND created_at <= $3`,
      [email, startOfToday, endOfToday]
    ),
    query(
      `SELECT * FROM transactions 
     WHERE merchant_email = $1 
     AND created_at >= $2 
     AND created_at <= $3`,
      [email, startOfYesterday, endOfYesterday]
    ),
    query(
      `SELECT * FROM transactions 
     WHERE merchant_email = $1 
     AND created_at >= $2`,
      [email, last7Days]
    ),
    query(
      `SELECT * FROM transactions 
     WHERE merchant_email = $1 
     AND created_at >= $2`,
      [email, last30Days]
    ),
    query(
      `SELECT * FROM transactions 
     WHERE merchant_email = $1 
     AND created_at >= $2`,
      [email, lastMonth]
    ),
    query(
      `SELECT * FROM transactions 
     WHERE merchant_email = $1 
     AND created_at >= $2`,
      [email, thisYear]
    ),
    query(
      `SELECT * FROM transactions 
     WHERE merchant_email = $1 
     AND created_at >= $2`,
      [email, lifetime]
    ),
  ]);

  const BDTAmount = (amount, currency) =>
    currency === "BDT" ? Number(amount) : "";

  const USDAmount = (amount, currency) =>
    currency === "USD" ? Number(amount) : "";

  const todayAmountBDT = todayRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(BDTAmount(transaction.amount, transaction.currency)),
      0
    );

  const todayAmountUSD = todayRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(USDAmount(transaction.amount, transaction.currency)),
      0
    );

  const yesterdayAmountBDT = yesterdayRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(BDTAmount(transaction.amount, transaction.currency)),
      0
    );

  const yesterdayAmountUSD = yesterdayRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(USDAmount(transaction.amount, transaction.currency)),
      0
    );

  const last7DaysAmountBDT = last7Res?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(BDTAmount(transaction.amount, transaction.currency)),
      0
    );

  const last7DaysAmountUSD = last7Res?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(USDAmount(transaction.amount, transaction.currency)),
      0
    );

  const last30DaysAmountBDT = last30Res?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(BDTAmount(transaction.amount, transaction.currency)),
      0
    );

  const last30DaysAmountUSD = last30Res?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(USDAmount(transaction.amount, transaction.currency)),
      0
    );

  const lastMonthAmountBDT = lastMonthRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(BDTAmount(transaction.amount, transaction.currency)),
      0
    );

  const lastMonthAmountUSD = lastMonthRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(USDAmount(transaction.amount, transaction.currency)),
      0
    );

  const thisYearAmountBDT = thisYearRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(BDTAmount(transaction.amount, transaction.currency)),
      0
    );

  const thisYearAmountUSD = thisYearRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(USDAmount(transaction.amount, transaction.currency)),
      0
    );

  const lifetimeAmountBDT = lifetimeRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(BDTAmount(transaction.amount, transaction.currency)),
      0
    );

  const lifetimeAmountUSD = lifetimeRes?.rows
    ?.filter((transaction) => transaction.status === "success")
    .reduce(
      (total, transaction) =>
        Number(total) +
        Number(USDAmount(transaction.amount, transaction.currency)),
      0
    );

  const transactions = await query(
    `SELECT * FROM transactions WHERE merchant_email = $1`,
    [email]
  );

  const plan = await query(`SELECT plan FROM users WHERE email = $1`, [email]);

  if (plan.rowCount > 0) {
    const userPlan = plan?.rows[0]?.plan;
    if (userPlan == "1") {
      const totalCount = await query(
        `SELECT COUNT(*) FROM transactions WHERE merchant_email = $1 AND status = 'success'`,
        [email]
      );

      const pendingCount = await query(
        `SELECT COUNT(*) FROM transactions WHERE merchant_email = $1 AND status = 'pending'`,
        [email]
      );
      return NextResponse.json(
        {
          todayAmount: {
            BDT: Number(todayAmountBDT),
            USD: Number(todayAmountUSD),
          },
          yesterdayAmount: {
            BDT: Number(yesterdayAmountBDT),
            USD: Number(yesterdayAmountUSD),
          },
          last7DaysAmount: {
            BDT: Number(last7DaysAmountBDT),
            USD: Number(last7DaysAmountUSD),
          },
          last30DaysAmount: {
            BDT: Number(last30DaysAmountBDT),
            USD: Number(last30DaysAmountUSD),
          },
          lastMonthAmount: {
            BDT: Number(lastMonthAmountBDT),
            USD: Number(lastMonthAmountUSD),
          },
          thisYearAmount: {
            BDT: Number(thisYearAmountBDT),
            USD: Number(thisYearAmountUSD),
          },
          lifetimeAmount: {
            BDT: Number(lifetimeAmountBDT),
            USD: Number(lifetimeAmountUSD),
          },
          totalCount: totalCount.rows[0].count,
          pendingCount: pendingCount.rows[0].count,
          transactions: transactions?.rows,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          todayAmount: {
            BDT: Number(todayAmountBDT),
            USD: Number(todayAmountUSD),
          },
          yesterdayAmount: {
            BDT: Number(yesterdayAmountBDT),
            USD: Number(yesterdayAmountUSD),
          },
          last7DaysAmount: {
            BDT: Number(last7DaysAmountBDT),
            USD: Number(last7DaysAmountUSD),
          },
          last30DaysAmount: {
            BDT: Number(last30DaysAmountBDT),
            USD: Number(last30DaysAmountUSD),
          },
          lastMonthAmount: {
            BDT: Number(lastMonthAmountBDT),
            USD: Number(lastMonthAmountUSD),
          },
          thisYearAmount: {
            BDT: Number(thisYearAmountBDT),
            USD: Number(thisYearAmountUSD),
          },
          lifetimeAmount: {
            BDT: Number(lifetimeAmountBDT),
            USD: Number(lifetimeAmountUSD),
          },
          transactions: transactions?.rows,
        },
        { status: 200 }
      );
    }
  }
}
