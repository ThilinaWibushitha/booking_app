import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

// Ensure all required environment variables are available
if (!PGHOST || !PGUSER || !PGPASSWORD || !PGDATABASE) {
  throw new Error("Missing required PostgreSQL environment variables.");
}

// Securely construct the PostgreSQL connection string
const connectionString = `postgres://${encodeURIComponent(
  PGUSER
)}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}/${PGDATABASE}?sslmode=require`;

export const sql = neon(connectionString);
