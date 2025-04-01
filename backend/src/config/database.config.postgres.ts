import { Client, Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const postgresDBClient = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const postgresDBPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV === "test") {
  postgresDBClient.host = "localhost";
  postgresDBClient.port = 5432;
  postgresDBClient.database = "postgres";
  postgresDBClient.user = "postgres";
  postgresDBClient.password = "mbc299748";
}
