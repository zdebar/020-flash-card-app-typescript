import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { validateEnvVariables } from "../utils/validate.utils";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
validateEnvVariables([
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
]);

export let postgresDBPool: Pool;
if (process.env.NODE_ENV === "test") {
  postgresDBPool = new Pool({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "mbc299748",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} else {
  postgresDBPool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}
