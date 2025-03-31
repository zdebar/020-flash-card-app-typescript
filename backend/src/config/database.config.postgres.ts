import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const postgresDB = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

if (process.env.NODE_ENV === "test") {
  postgresDB.host = "localhost";
  postgresDB.port = 5432;
  postgresDB.database = "postgres";
  postgresDB.user = "postgres";
  postgresDB.password = "mbc299748";
}

export default postgresDB;
