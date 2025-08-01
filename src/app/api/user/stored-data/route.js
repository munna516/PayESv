import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    // check the stored data exist or not

    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stored_data'
      );
    `;

    const tableExists = await query(checkTableQuery);

    if (!tableExists.rows[0].exists) {
      // Create stored_data table if it doesn't exist
      await query(`
        CREATE TABLE stored_data (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          message VARCHAR(255) NOT NULL,
          category VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    const data = await query(`SELECT * FROM stored_data WHERE email = $1 ORDER BY created_at DESC`, [
      email,
    ]);
    if (data.rowCount > 0) {
      return NextResponse.json(data.rows || []);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { email, message, category, status, id } = await req.json();

    if (!email || !message || !category || !status) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stored_data'
      );
    `;

    const tableExists = await query(checkTableQuery);

    if (!tableExists.rows[0].exists) {
      // Create stored_data table if it doesn't exist
      await query(`
        CREATE TABLE stored_data (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          message VARCHAR(255) NOT NULL,
          category VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // If editing (id exists), update the record
    if (id) {
      const updateResult = await query(
        `UPDATE stored_data SET message = $1, category = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND email = $5 RETURNING *`,
        [message, category, status, id, email]
      );

      if (updateResult.rowCount > 0) {
        return NextResponse.json({
          success: true,
          message: "Data updated successfully",
          data: updateResult.rows[0]
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Record not found or you don't have permission to edit"
        }, { status: 404 });
      }
    }

    // For new records, check if email and category combination already exists
    const existingRecord = await query(
      `SELECT * FROM stored_data WHERE email = $1 AND category = $2`,
      [email, category]
    );

    if (existingRecord.rowCount > 0) {
      return NextResponse.json({
        success: false,
        message: "A record with this email and category already exists"
      }, { status: 409 });
    }

    // Insert new record
    const insertResult = await query(
      `INSERT INTO stored_data (email, message, category, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, message, category, status]
    );

    return NextResponse.json({
      success: true,
      message: "Data added successfully",
      data: insertResult.rows[0]
    });

  } catch (error) {
    console.error('Error in POST /api/user/stored-data:', error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
