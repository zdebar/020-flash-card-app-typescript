import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}
console.log(process.env.NODE_ENV)

const postgresDB = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default postgresDB;

