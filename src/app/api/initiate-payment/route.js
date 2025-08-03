import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const headers = req.headers;
    const { amount, currency, customer, orderId, redirectUrl } =
      await req.json();

    const apiKey = headers.get("x-api-key");
    const apiSecret = headers.get("x-api-secret");
    const brandKey = headers.get("x-brand-key");
    if (!apiKey || !apiSecret || !brandKey) {
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 401 }
      );
    }

    if (!amount || !currency || !customer || !orderId || !redirectUrl) {
      return NextResponse.json(
        { error: "Missing required fields in body" },
        { status: 400 }
      );
    }

    // ✅ Validate merchant
    const merchant = await query(
      "SELECT * FROM brands WHERE api_key = $1 AND api_secret = $2 AND brand_key = $3",
      [apiKey, apiSecret, brandKey]
    );
    const marchant_email = merchant.rows[0].email;

    if (merchant.length === 0) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    const id = uuidv4();

    //   check Transaction table exists or not

    const checkTableQuery = `
     SELECT EXISTS (
       SELECT FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_name = 'transactions'
     );
   `;

    const tableExists = await query(checkTableQuery);

    if (!tableExists.rows[0].exists) {
      await query(`CREATE TABLE transactions (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        payment_id VARCHAR(255),
        transaction_id VARCHAR(255),
        order_id VARCHAR(255) NOT NULL,
        merchant_email VARCHAR(255) NOT NULL,
        payment_method VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        redirect_success_url VARCHAR(255) NOT NULL,
        redirect_failed_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    }
    // ✅ Store pending transaction (optional but recommended)
    const response = await query(
      `INSERT INTO transactions (id, order_id, merchant_email, amount, currency, status, customer_name, customer_email, customer_phone, redirect_success_url, redirect_failed_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        orderId,
        marchant_email,
        amount,
        currency,
        "pending",
        customer.name,
        customer.email,
        customer.phone,
        redirectUrl.success,
        redirectUrl.failed,
      ]
    );

    return NextResponse.json(
      {
        message: "Payment initiated successfully",
        id,
        redirectGatewayUrl: `https://checkout.payesv.com/pay/${id}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Invalid API Key or API Secret or Brand Key",
    },{status: 400});
  }
}
