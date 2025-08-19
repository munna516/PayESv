import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const user = await query(
    "SELECT * FROM user_plan WHERE email = $1 AND status = 'Active' ORDER BY id DESC LIMIT 1",
    [email]
  );
  if (user.rowCount > 0) {
    const userData = user.rows[0];
    if (new Date(userData?.expires_at) < new Date()) {
      const updateUser = await query(
        "UPDATE user_plan SET status = 'Expired' WHERE id = $1",
        [userData.id]
      );
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(userData);
  } else {
    const userData = user.rows;
    return NextResponse.json(userData);
  }
};
