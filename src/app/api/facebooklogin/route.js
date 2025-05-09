import { query } from "@/lib/db";

export const POST = async (req) => {
  try {
    const { email, name, profile_picture, provider } = await req.json();
    // Check if user already exists
    const userExists = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rowCount > 0) {
      // User exists, retrieve their role
      const user = userExists.rows[0];
      return Response.json(
        {
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
          provider: user.provider,
          role: user.role,
          created_at: user.created_at,
        },
        { status: 200 }
      );
    }

    const role = "user";
    // Insert user into database
    const insertUserQuery = `
      INSERT INTO users (name, email, profile_picture, provider, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING name, email, profile_picture, provider, role, created_at
    `;

    const values = [name, email, profile_picture, provider, role];

    const result = await query(insertUserQuery, values);
    const newUser = result.rows[0];
    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Facebook login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
