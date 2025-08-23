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

      const pendingAmountBDT = transactions
        .filter((transaction) => transaction.status === "pending")
        .reduce((total, transaction) => {
          const amountInBDT =
            transaction.currency === "BDT" ? Number(transaction.amount) : "";
          return Number(Number(total) + Number(amountInBDT));
        }, 0);

      const pendingAmountUSD = transactions
        .filter((transaction) => transaction.status === "pending")
        .reduce((total, transaction) => {
          const amountInUSD =
            transaction.currency === "USD" ? Number(transaction.amount) : "";
          return Number(Number(total) + Number(amountInUSD));
        }, 0);

      const successAmountBDT = transactions
        .filter((transaction) => transaction.status === "success")
        .reduce((total, transaction) => {
          const amountInBDT =
            transaction.currency === "BDT" ? Number(transaction.amount) : "";
          return Number(Number(total) + Number(amountInBDT));
        }, 0);

      const successAmountUSD = transactions
        .filter((transaction) => transaction.status === "success")
        .reduce((total, transaction) => {
          const amountInUSD =
            transaction.currency === "USD" ? Number(transaction.amount) : "";
          return Number(Number(total) + Number(amountInUSD));
        }, 0);

      const allPaymentsBDT = Number(successAmountBDT) + Number(pendingAmountBDT);
      const allPaymentsUSD = Number(successAmountUSD) + Number(pendingAmountUSD);

      return NextResponse.json(
        {
          transactions,
          successAmount: {
            BDT: Number(successAmountBDT),
            USD: Number(successAmountUSD),
          },
          pendingAmount: {
            BDT: Number(pendingAmountBDT),
            USD: Number(pendingAmountUSD),
          },
          allPayments: {
            BDT: Number(allPaymentsBDT),
            USD: Number(allPaymentsUSD),
          },
        },
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

      const BDTAmount = (amount, currency) =>
        currency === "BDT" ? Number(amount) : "";

      const USDAmount = (amount, currency) =>
        currency === "USD" ? Number(amount) : "";

      const todayAmountBDT = todayRes?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(BDTAmount(transaction.amount, transaction.currency)),
          0
        );

      const todayAmountUSD = todayRes?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(USDAmount(transaction.amount, transaction.currency)),
          0
        );

      const yesterdayAmountBDT = yesterdayRes?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(BDTAmount(transaction.amount, transaction.currency)),
          0
        );

      const yesterdayAmountUSD = yesterdayRes?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(USDAmount(transaction.amount, transaction.currency)),
          0
        );

      const last7DaysAmountBDT = last7Res?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(BDTAmount(transaction.amount, transaction.currency)),
          0
        );

      const last7DaysAmountUSD = last7Res?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(USDAmount(transaction.amount, transaction.currency)),
          0
        );

      const last30DaysAmountBDT = last30Res?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(BDTAmount(transaction.amount, transaction.currency)),
          0
        );

      const last30DaysAmountUSD = last30Res?.rows
        ?.filter((transaction) => transaction.status === "success")
        .reduce(
          (total, transaction) =>
            Number(total) + Number(USDAmount(transaction.amount, transaction.currency)),
          0
        );
      const transactions = await query(
        `SELECT * FROM transactions WHERE merchant_email = $1`,
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
          transactions: transactions?.rows,
        },
        { status: 200 }
      );
    }
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}
