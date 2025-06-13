import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const POST = async (request) => {
  const { thumbnail, title, description, date, status } = await request.json();
  const result = await query(
    `
    INSERT INTO blogs (thumbnail, title, description, date, status)
    VALUES ($1, $2, $3, $4, $5)
  `,
    [thumbnail, title, description, date, status]
  );
  return NextResponse.json(result);
};

export const GET = async () => {
  // check blogs table exists
  const checkTableQuery = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'blogs'
        );
    `;
  const tableExists = await query(checkTableQuery);

  if (!tableExists.rows[0].exists) {
    // create blogs table
    const createTableQuery = `
            CREATE TABLE blogs (
                id SERIAL PRIMARY KEY,
                thumbnail VARCHAR(255),
                title VARCHAR(255),
                description TEXT,
                date DATE,
                status VARCHAR(255)
            )
        `;
    await query(createTableQuery);
  }

  const result = await query("SELECT * FROM blogs");
  return NextResponse.json(result);
};

export const DELETE = async (request) => {
  const { id } = await request.json();
  const result = await query("DELETE FROM blogs WHERE id = $1", [id]);
  return NextResponse.json(result);
};

export const PUT = async (request) => {
  const { id, thumbnail, title, description, date, status } = await request.json();
  const result = await query(
    "UPDATE blogs SET thumbnail = $1, title = $2, description = $3, date = $4, status = $5 WHERE id = $6",
    [thumbnail, title, description, date, status, id]
  );
  return NextResponse.json(result);
};