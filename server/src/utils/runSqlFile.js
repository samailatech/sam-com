import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool from "../db.js";

dotenv.config();

async function main() {
  const relativePath = process.argv[2];
  if (!relativePath) {
    throw new Error("SQL file path is required");
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const absolutePath = path.resolve(__dirname, relativePath);

  const sql = fs.readFileSync(absolutePath, "utf8");
  await pool.query(sql);
  await pool.end();
  console.log(`Executed ${absolutePath}`);
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
