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

export async function POST(req) {
  try {
    const { email, plan, websitequantity, yearly } = await req.json();
    const userExist = await query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (userExist.rowCount == 0) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const user = userExist.rows[0];

    if (plan == 1) {
      let expires_at = null;
      if (yearly) {
        expires_at = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        );
      } else {
        expires_at = new Date(new Date().setMonth(new Date().getMonth() + 1));
      }
      const userPlan = await query(
        `INSERT INTO user_plan (email, websitequantity,plan, yearly,status,expires_at) VALUES ($1, $2, $3, $4, $5, $6)`,
        [email, websitequantity, plan, yearly, "Active", expires_at]
      );

      const updateUser = await query(
        `UPDATE users SET plan = $1 WHERE email = $2`,
        [plan, email]
      );
      return NextResponse.json({ message: "User plan added successfully" });
    } else {
      const expires_at = new Date(
        new Date().setFullYear(new Date().getFullYear() + 10)
      );

      const updateUser = await query(
        `UPDATE users SET plan = $1 WHERE email = $2`,
        [plan, email]
      );
      const userPlan = await query(
        `INSERT INTO user_plan (email,websitequantity,plan,yearly,status,expires_at) VALUES ($1, $2, $3, $4, $5, $6)`,
        [email, "Unlimited", plan, false, "Active", expires_at]
      );

      return NextResponse.json({ message: "User plan added successfully" });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add user plan" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { id, plan, websitequantity, expires_at } = await req.json();
    const date = new Date(expires_at);
    const formatted =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0") +
      " " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0") +
      "." +
      Math.floor(date.getMilliseconds() / 100); 

    if (plan == 1) {
      console.log(plan, websitequantity, expires_at);
      const updateUserPlan = await query(
        `UPDATE user_plan SET websitequantity = $1, expires_at = $2 WHERE id = $3`,
        [websitequantity, formatted, id]
      );
      return NextResponse.json({ message: "User plan updated successfully" });
    } else if (plan == 2) {
      console.log(plan, expires_at);
      const updateUserPlan = await query(
        `UPDATE user_plan SET expires_at = $1 WHERE id = $2`,
        [formatted, id]
      );
      return NextResponse.json({ message: "User plan updated successfully" });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user plan" },
      { status: 500 }
    );
  }
}
