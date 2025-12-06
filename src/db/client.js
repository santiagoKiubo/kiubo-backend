// src/db/client.js
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Railway Postgres we don't need custom SSL options.
  // If in the future we need SSL (e.g. Supabase), we can add a flag-based config.
});

module.exports = { pool };