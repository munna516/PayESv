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
        profile_picture,
        city, 
        postal_code, 
        country, 
        password_hash,
        role,
        provider,
        plan,
        status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING id, name, email, role, provider, phone, plan, status
    `;
    const role = "user";
    const provider = "local";
    const plan = "0";
    const status = "active";
    const profile_picture = null;

    const values = [
      name,
      email,
      websiteUrl || null,
      phone || null,
      streetAddress,
      profile_picture,
      city,
      postalCode,
      country,
      hashedPassword,
      role,
      provider,
      plan,
      status,
    ];

    const result = await query(insertUserQuery, values);
    const newUser = result.rows[0];

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
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
