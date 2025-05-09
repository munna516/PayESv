import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const {
      name,
      email,
      websiteUrl,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      password,
    } = body;

    // Check if required fields are present
    if (
      !name ||
      !email ||
      !streetAddress ||
      !city ||
      !postalCode ||
      !country ||
      !password
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userExists = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userExists.rowCount > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const insertUserQuery = `
      INSERT INTO users (
        name, 
        email, 
        website_url, 
        phone, 
        street_address, 
        city, 
        postal_code, 
        country, 
        password_hash,
        role,
        provider
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING id, name, email, role, provider, created_at
    `;
    const role = "user";
    const provider = "local";

    const values = [
      name,
      email,
      websiteUrl || null,
      phone || null,
      streetAddress,
      city,
      postalCode,
      country,
      hashedPassword,
      role,
      provider,
    ];

    const result = await query(insertUserQuery, values);
    const newUser = result.rows[0];

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          provider: newUser.provider,
          createdAt: newUser.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
