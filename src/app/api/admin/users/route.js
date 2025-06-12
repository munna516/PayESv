import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";

export const GET = async () => {
  const users = await query("SELECT * FROM users where role = 'user'");
  return NextResponse.json(users);
};

export const POST = async (request) => {
  const { firstName, lastName, email, phone, password, status } =
    await request.json();
  const name = `${firstName} ${lastName}`;
  // check if user already exists
  const userExists = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  console.log("this is userExists", userExists);
  if (userExists.rowCount > 0) {
    return NextResponse.json({ error: "User already exists" });
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const user = await query(
    "INSERT INTO users (name, email, phone, password_hash, status) VALUES ($1, $2, $3, $4, $5)",
    [name, email, phone, password_hash, status]
  );
  console.log("this is user", user);
  return NextResponse.json(user);
};

export const DELETE = async (request) => {
  const { id } = await request.json();
  const user = await query("DELETE FROM users WHERE id = $1", [id]);
  return NextResponse.json(user);
};

export const PUT = async (request) => {
  const {  firstName, lastName, email, phone, status } =
    await request.json();
  const name = `${firstName} ${lastName}`;
  const user = await query(
    "UPDATE users SET name = $1, email = $2, phone = $3, status = $4 WHERE email = $5",
    [name, email, phone, status, email]
  );
  return NextResponse.json(user);
};
