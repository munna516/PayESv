import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  const users = await query("SELECT * FROM users where role = 'user'");
  return NextResponse.json(users);
};
