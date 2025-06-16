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
    "SELECT * FROM tickets where status = 'Pending' or status = 'In Progress' or status = 'Resolved' ORDER BY createdAt DESC"
  );
  return NextResponse.json(result);
};

export const PUT = async (req) => {
  const { id } = await req.json();
  // First check ticket status is not resolved
  const checkStatusQuery = `SELECT status FROM tickets WHERE id = ${id}`;
  const status = await query(checkStatusQuery);
  if (status.rows[0].status === "Resolved") {
    return NextResponse.json({ message: "Ticket is already resolved" });
  } else if (status.rows[0].status === "In Progress") {
    return NextResponse.json({ message: "Ticket is already in progress" });
  } else if (status.rows[0].status === "Pending") {
    const updateQuery = `UPDATE tickets SET status = 'In Progress' WHERE id = ${id}`;
    await query(updateQuery);
    return NextResponse.json({
      message: "Ticket status updated to in progress",
    });
  }
};

export const DELETE = async (req) => {
  const { id } = await req.json();
  const deleteQuery = `DELETE FROM tickets WHERE id = ${id}`;
  await query(deleteQuery);
  return NextResponse.json({ message: "Ticket deleted successfully" });
};
