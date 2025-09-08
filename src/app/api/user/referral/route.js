import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  console.log(email)

  // check if the referral table exists
  const checkTableQuery = `
 SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name = 'affiliate'
 );
`;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
     CREATE TABLE affiliate (
         id SERIAL PRIMARY KEY,
         email VARCHAR(255) NOT NULL,
         visits INT NOT NULL,
         registrations INT NOT NULL,
         referrals INT NOT NULL,
         total_earnings INT NOT NULL,
         available_earnings INT NOT NULL,
         available_withdrawals INT NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     )
 `;
    await query(createTableQuery);
  }
  const referral = await query(`SELECT * FROM affiliate WHERE email = $1`, [
    email
  ]);
  
  if (referral.rows.length === 0) {
    const insertReferralQuery = `
      INSERT INTO affiliate (email, visits, registrations, referrals, total_earnings, available_earnings, available_withdrawals)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await query(insertReferralQuery, [email, 0, 0, 0, 0, 0, 0]);
  }
  return NextResponse.json(referral.rows[0]);
}

export async function POST(request) {
  const { id } = await request.json();
  let email = id + "@gmail.com";
  // check if the referral table exists
  const checkTableQuery = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'affiliate'
        );
    `;
  const tableExists = await query(checkTableQuery);
  if (!tableExists.rows[0].exists) {
    const createTableQuery = `
            CREATE TABLE affiliate (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                visits INT NOT NULL,
                registrations INT NOT NULL,
                referrals INT NOT NULL,
                total_earnings INT NOT NULL,
                available_earnings INT NOT NULL,
                available_withdrawals INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await query(createTableQuery);
  }
  const referral = await query(`SELECT * FROM affiliate WHERE email = $1`, [
    email,
  ]);
  if (referral.rows.length === 0) {
    const insertReferralQuery = `
      INSERT INTO affiliate (email, visits, registrations, referrals, total_earnings, available_earnings, available_withdrawals)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await query(insertReferralQuery, [email, 0, 0, 0, 0, 0, 0]);
  }
  const updateReferralQuery = `
    UPDATE affiliate SET visits = visits + 1 WHERE email = $1
  `;
  await query(updateReferralQuery, [email]);
  return NextResponse.json(referral);
}
