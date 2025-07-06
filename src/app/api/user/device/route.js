import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  const { email, deviceInfo } = await req.json();
  console.log(email, deviceInfo);
  const ipAddress =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");

  // check if the device table exists
  const checkDeviceTableQuery = `
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'devices'
  );
`;

  const tableExists = await query(checkDeviceTableQuery);

  if (!tableExists.rows[0].exists) {
    const createDeviceTableQuery = `
        CREATE TABLE devices (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            device_type VARCHAR(255) NOT NULL,
            os VARCHAR(255) NOT NULL,
            browser VARCHAR(255) NOT NULL,
            screen_resolution VARCHAR(255) NOT NULL,
            js_enabled BOOLEAN NOT NULL,
            cookies_enabled BOOLEAN NOT NULL,
            time_zone VARCHAR(255) NOT NULL,
            ip_address VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await query(createDeviceTableQuery);
  }

  // check if the device info already exists
  const checkDeviceInfoQuery = `
    SELECT * FROM devices WHERE email = $1 AND ip_address = $2
  `;
  const deviceInfoExists = await query(checkDeviceInfoQuery, [
    email,
    ipAddress,
  ]);
  if (deviceInfoExists.rows.length > 0) {
    return NextResponse.json({ message: "Device info already exists" });
  }

  const insertDeviceInfoQuery = `
    INSERT INTO devices (email, device_type, os, browser, screen_resolution, js_enabled, cookies_enabled, time_zone, ip_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  await query(insertDeviceInfoQuery, [
    email,
    deviceInfo.deviceType,
    deviceInfo.os,
    deviceInfo.browser,
    deviceInfo.screenResolution,
    deviceInfo.jsEnabled,
    deviceInfo.cookiesEnabled,
    deviceInfo.timeZone,
    ipAddress,
  ]);

  return NextResponse.json({ message: "Device info received" });
}

export async function GET(req) {
  const email = req.nextUrl.searchParams.get("email");
  const getDevicesQuery = `
    SELECT * FROM devices WHERE email = $1
  `;
  const devices = await query(getDevicesQuery, [email]);
  return NextResponse.json(devices);
}
