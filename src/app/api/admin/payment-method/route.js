import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // check payment method table is exists
    const checkTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'payment_methods'
    );
    `;
    const tableExists = await query(checkTableQuery);
    if (!tableExists.rows[0].exists) {
      const createTableQuery = `
        CREATE TABLE payment_methods (
          id SERIAL PRIMARY KEY,
          method_logo VARCHAR(255) NOT NULL,
          method_name VARCHAR(255) NOT NULL,
          method_type VARCHAR(255) NOT NULL,
          sort INT NOT NULL,
          status VARCHAR(255) NOT NULL
        )
      `;
      await query(createTableQuery);
    }
    const paymentMethods = await query("SELECT * FROM payment_methods ORDER BY sort ASC");
    return NextResponse.json(paymentMethods);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { method_logo, method_name, method_type, sort, status } =
      await req.json();

    const createPaymentMethodQuery = `
      INSERT INTO payment_methods (method_logo, method_name, method_type, sort, status) VALUES ($1, $2, $3, $4, $5)
    `;
    const result = await query(createPaymentMethodQuery, [
      method_logo,
      method_name,
      method_type,
      sort,
      status,
    ]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment method" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { id, method_logo, method_name, method_type, sort, status } =
      await req.json();
    const updatePaymentMethodQuery = `
      UPDATE payment_methods SET method_logo = $1, method_name = $2, method_type = $3, sort = $4, status = $5 WHERE id = $6
    `;
    const result = await query(updatePaymentMethodQuery, [
      method_logo,
      method_name,
      method_type,
      sort,
      status,
      id,
    ]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const deletePaymentMethodQuery = `
      DELETE FROM payment_methods WHERE id = $1
    `;
    const result = await query(deletePaymentMethodQuery, [id]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 }
    );
  }
}
