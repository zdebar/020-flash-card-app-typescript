import { postgresDBPool } from "../config/database.config.postgres";
import { PostgresClient } from "../types/dataTypes";
import { PoolClient } from "pg";

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
    console.log("Database connected successfully at port", process.env.DB_PORT);
  } catch (err: any) {
    console.error("Failed to connect to the database:", err.message);
    throw new Error("Database connection failed.");
  }
}

/**
 * Util function for handling database connections.
 */
export async function withDbClient<T>(
  db: PostgresClient,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  let client: PoolClient | undefined;
  try {
    client = (await db.connect()) as PoolClient;
    return await callback(client);
  } catch (err: any) {
    throw new Error(`Database connection failed: ${err.message}`);
  } finally {
    if (client) {
      client.release();
    }
  }
}
