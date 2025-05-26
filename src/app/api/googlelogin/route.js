import { query } from "@/lib/db";

export const POST = async (req) => {
  try {
    const { email, name, profile_picture, provider } = await req.json();

    // Check if users table exists and create if not
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;

    const tableExists = await query(checkTableQuery);

    if (!tableExists.rows[0].exists) {
      // Create users table if it doesn't exist
      await query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          website_url VARCHAR(255),
          profile_picture VARCHAR(255),
          phone VARCHAR(50),
          street_address VARCHAR(255),
          city VARCHAR(100),
          postal_code VARCHAR(20),
          country VARCHAR(100),
          password_hash VARCHAR(255),
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          provider VARCHAR(50) NOT NULL DEFAULT 'local',
          plan VARCHAR(50) NOT NULL DEFAULT '0',
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Check if user already exists
    const userExists = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rowCount > 0) {
      // User exists, retrieve their role
      const user = userExists.rows[0];
      return Response.json(
        {
          user: user,
        },
        { status: 200 }
      );
    }

    const role = "user";
    const plan = "0";
    const status = "active";

    // Insert user into database
    const insertUserQuery = `
  INSERT INTO users (name, email, profile_picture, provider, role, plan, status)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING name, email, profile_picture, provider, role, created_at
`;

    const values = [name, email, profile_picture, provider, role, plan, status];

    const result = await query(insertUserQuery, values);
    const newUser = result.rows[0];
    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Google login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
