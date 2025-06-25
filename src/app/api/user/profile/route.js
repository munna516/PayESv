import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const users = await query("SELECT * FROM users WHERE email = $1", [email]);
  return NextResponse.json(users);
};

export const PUT = async (req) => {
  const { name, phone, street_address, email } = await req.json();
  const users = await query(
    "UPDATE users SET name = $1, phone = $2, street_address = $3 WHERE email = $4",
    [name, phone, street_address, email]
  );
  return NextResponse.json(users);
};

export const POST = async (req) => {
  const { currentPassword, newPassword, email } = await req.json();

  try {
    //   check if current password is correct
    const user = await query("SELECT * FROM users WHERE email = $1", [email]);

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.rows[0].password_hash
    );

    if (!passwordMatch) {
      return NextResponse.json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const users = await query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      [hashedPassword, email]
    );
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
