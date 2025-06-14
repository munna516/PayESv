import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { question, answer, sort, status } = await request.json();
  const result = await query(
    "INSERT INTO faqs (question, answer,sort,status) VALUES ($1, $2, $3, $4)",
    [question, answer, sort, status]
  );
  return NextResponse.json(result);
};

export const GET = async () => {
  const checkTableQuery = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'faqs'
        );
    `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
            CREATE TABLE faqs (
                id SERIAL PRIMARY KEY,
                question TEXT,
                answer TEXT,
                sort INT,
                status VARCHAR(255)
            )
        `;
    await query(createTableQuery);
  }
  const result = await query("SELECT * FROM faqs");
  return NextResponse.json(result);
};

export const DELETE = async (request) => {
  const { id } = await request.json();
  const result = await query("DELETE FROM faqs WHERE id = $1", [id]);
  return NextResponse.json(result);
};


export const PUT = async (request) => {
  const { id, question, answer, sort, status } = await request.json();
  const result = await query("UPDATE faqs SET question = $1, answer = $2, sort = $3, status = $4 WHERE id = $5", [question, answer, sort, status, id]);
  return NextResponse.json(result);
};



