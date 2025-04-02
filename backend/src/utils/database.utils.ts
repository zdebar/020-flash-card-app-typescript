import { postgresDBPool } from "../config/database.config.postgres";

/**
 * Checks the connection to the database by attempting to acquire and release a client
 * from the PostgreSQL connection pool.
 *
 * @throws {Error} Throws an error if the database connection fails.
 * @returns {Promise<void>} A promise that resolves if the connection is successful.
 */
export async function checkDatabaseConnection(): Promise<void> {
  try {
    const client = await postgresDBPool.connect();
    client.release();
    console.log("Database connected successfully.");
  } catch (err: any) {
    console.error("Failed to connect to the database:", err.message);
    throw new Error("Database connection failed.");
  }
}
