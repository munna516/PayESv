import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const plan = await query(`SELECT plan FROM users WHERE email = $1`, [email]);
  if (plan.rowCount > 0) {
    const userPlan = plan?.rows[0]?.plan;
    if (userPlan == "1") {
      const data = await query(
        `SELECT * FROM transactions WHERE merchant_email = $1`,
        [email]
      );

      const transactions = data?.rows;

      const pendingAmount = transactions
        .filter((transaction) => transaction.status === "pending")
        .reduce((total, transaction) => {
          const amountInBDT =
            transaction.currency === "USD"
              ? Number(transaction.amount) * 123
              : Number(transaction.amount);
          return total + amountInBDT;
        }, 0);

      const successAmount = transactions
        .filter((transaction) => transaction.status === "success")
        .reduce((total, transaction) => {
          const amountInBDT =
            transaction.currency === "USD"
              ? Number(transaction.amount) * 123
              : Number(transaction.amount);
          return total + amountInBDT;
        }, 0);

      const allPayments = successAmount + pendingAmount;

      return NextResponse.json(
        { transactions, successAmount, pendingAmount, allPayments },
        { status: 200 }
      );
    } else {
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

      // Queries
      const [todayRes, yesterdayRes, last7Res, last30Res] = await Promise.all([
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
      ]);

      const convertToBDT = (amount, currency) =>
        currency === "USD" ? Number(amount) * 123 : Number(amount);

      const todayAmount = todayRes?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            total + convertToBDT(transaction.amount, transaction.currency),
          0
        );

      const yesterdayAmount = yesterdayRes?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            total + convertToBDT(transaction.amount, transaction.currency),
          0
        );

      const last7DaysAmount = last7Res?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            total + convertToBDT(transaction.amount, transaction.currency),
          0
        );

      const last30DaysAmount = last30Res?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            total + convertToBDT(transaction.amount, transaction.currency),
          0
        );

      const transactions = await query(
        `SELECT * FROM transactions WHERE merchant_email = $1`,
        [email]
      );

      return NextResponse.json(
        {
          todayAmount,
          yesterdayAmount,
          last7DaysAmount,
          last30DaysAmount,
          transactions: transactions?.rows,
        },
        { status: 200 }
      );
    }
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}
