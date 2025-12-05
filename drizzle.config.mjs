// drizzle.config.mjs
import dotenv from "dotenv";
dotenv.config();                     // force-load .env

import { defineConfig } from "drizzle-kit";

console.log("DATABASE_URL in config:", process.env.DATABASE_URL); // debug

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});