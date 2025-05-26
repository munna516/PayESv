import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { email, password } = await request.json();

    // Check if user already exists
    const userExists = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rowCount === 0) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }
    
    const user = userExists.rows[0];
    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }
    const { password_hash: _, ...userWithoutPassword } = user;
    return Response.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
