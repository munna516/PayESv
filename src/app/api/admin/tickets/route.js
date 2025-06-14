import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const GET = async () => {
  // check tickets table exists
  const checkTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'tickets'
    );
    `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        paymentMethod VARCHAR(255),
        transactionId VARCHAR(255),
        websiteLink VARCHAR(255),
        description TEXT NOT NULL,
        status VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await query(createTableQuery);
  }
  const result = await query(
    "SELECT * FROM tickets where status = 'Pending' ORDER BY createdAt DESC"
  );
  return NextResponse.json(result);
};
