import { Client } from "pg";
import logger from "./logger.utils";

/**
 * Closes the database connection gracefully.
 *
 * @param db - The database client instance to close.
 * @returns A promise that resolves when the connection is successfully closed.
 * @throws Logs an error message if the connection closure fails.
 */
export async function closeDbConnection(db: Client) {
  try {
    await db.end();
  } catch (err: any) {
    logger.error("Error closing database connection:", err.message);
  }
}
