import { Client } from "pg";
import logger from "./logger.utils";

export async function closeDbConnection(db: Client) {
  try {
    await db.end();
  } catch (err: any) {
    logger.error("Error closing database connection:", err.message);
  }
}
