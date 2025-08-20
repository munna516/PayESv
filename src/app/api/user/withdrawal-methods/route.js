import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET method - fetch user's withdrawal methods
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // check if the device table exists
    const checkWithdrawalTableQuery = `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'withdrawal_methods');`;

    const tableExists = await query(checkWithdrawalTableQuery);

    if (!tableExists.rows[0].exists) {
      await query(
        `CREATE TABLE withdrawal_methods (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          methods JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      );
    }

    // Get user's withdrawal methods
    const result = await query(
      "SELECT * FROM withdrawal_methods WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ methods: [] });
    }

    // Parse the methods JSON from the single row
    const userData = result.rows[0];
    const methods = userData.methods || [];

    return NextResponse.json({ methods });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch withdrawal methods" },
      { status: 500 }
    );
  }
}

// POST method - create/update user's withdrawal methods
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, methods } = body;

    if (!email || !methods) {
      return NextResponse.json(
        { message: "Email and methods are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(methods)) {
      return NextResponse.json(
        { message: "Methods must be an array" },
        { status: 400 }
      );
    }

    // Prevent duplicate categories (e.g., only one Bkash, one Rocket, etc.)
    const seenCategories = new Set();
    const duplicateCategories = new Set();
    for (const method of methods) {
      const category = (method?.category || "").trim();
      if (!category) continue;
      const key = category.toLowerCase();
      if (seenCategories.has(key)) {
        duplicateCategories.add(category);
      } else {
        seenCategories.add(key);
      }
    }
    if (duplicateCategories.size > 0) {
      return NextResponse.json(
        {
          message: "Method already added",
        },
        { status: 400 }
      );
    }

    // Check if user already has a record
    const existingResult = await query(
      "SELECT id FROM withdrawal_methods WHERE email = $1",
      [email]
    );

    if (existingResult.rows.length > 0) {
      // Update existing record
      await query(
        "UPDATE withdrawal_methods SET methods = $1, updated_at = NOW() WHERE email = $2",
        [JSON.stringify(methods), email]
      );
    } else {
      // Create new record
      await query(
        "INSERT INTO withdrawal_methods (email, methods, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
        [email, JSON.stringify(methods)]
      );
    }

    return NextResponse.json(
      {
        message: "Method saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save withdrawal methods" },
      { status: 500 }
    );
  }
}

// PUT method - update specific method
export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, methodId, updatedMethod } = body;

    if (!email || !methodId || !updatedMethod) {
      return NextResponse.json(
        { message: "Email, method ID, and updated method are required" },
        { status: 400 }
      );
    }

    // Get current methods
    const result = await query(
      "SELECT methods FROM withdrawal_methods WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "No withdrawal methods found for this user" },
        { status: 404 }
      );
    }

    const currentMethods = result.rows[0].methods || [];

    // Update the specific method
    const updatedMethods = currentMethods.map((method) =>
      method.id === methodId ? { ...method, ...updatedMethod } : method
    );

    // Prevent duplicate categories after update
    const seenCategories = new Set();
    for (const method of updatedMethods) {
      const category = (method?.category || "").trim().toLowerCase();
      if (seenCategories.has(category)) {
        return NextResponse.json(
          {
            message: `Duplicate methods are not allowed for category: ${method.category}`,
          },
          { status: 400 }
        );
      }
      seenCategories.add(category);
    }

    // Save updated methods
    await query(
      "UPDATE withdrawal_methods SET methods = $1, updated_at = NOW() WHERE email = $2",
      [JSON.stringify(updatedMethods), email]
    );

    return NextResponse.json({
      message: "Method updated successfully",
      methods: updatedMethods,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update withdrawal method" },
      { status: 500 }
    );
  }
}
