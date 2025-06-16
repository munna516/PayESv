import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { id } = await params;
  const ticket = await query(`SELECT * FROM tickets WHERE id = ${id}`);
  return NextResponse.json(ticket);
};

export const PUT = async (req, { params }) => {
  const { id } = await params;
  const { status } = await req.json();
  const ticket = await query(`UPDATE tickets SET status = '${status}' WHERE id = ${id}`);
  return NextResponse.json(ticket);
};