import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";

export const GET = async () => {
  const staff = await query(
    "SELECT * FROM users where role = 'admin' or role = 'support operator'"
  );
  return NextResponse.json(staff);
};

export const POST = async (request) => {
  const { firstName, lastName, email, phone, password, status, role } =
    await request.json();
  const name = `${firstName} ${lastName}`;
  // check if staff already exists
  const staffExists = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (staffExists.rowCount > 0) {
    return NextResponse.json({ error: "Staff already exists" });
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const staff = await query(
    "INSERT INTO users (name, email, phone, password_hash, status, role) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, email, phone, password_hash, status, role]
  );
  console.log("this is staff", staff);
  return NextResponse.json(staff);
};

export const DELETE = async (request) => {
  const { id } = await request.json();
  const user = await query("DELETE FROM users WHERE id = $1", [id]);
  return NextResponse.json(user);
};

export const PUT = async (request) => {
  const { firstName, lastName, email, phone, status, role } =
    await request.json();
  const name = `${firstName} ${lastName}`;
  const user = await query(
    "UPDATE users SET name = $1,  phone = $2, status = $3, role = $4 WHERE email = $5",
    [name, phone, status, role, email]
  );
  return NextResponse.json(user);
};
