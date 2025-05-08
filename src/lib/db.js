import { Pool } from "pg";

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Connected to PostgreSQL database");
    release();
  }
});

// Helper function to run SQL queries
const query = (text, params) => pool.query(text, params);

// Export as ES modules instead of CommonJS
export { query, pool };
