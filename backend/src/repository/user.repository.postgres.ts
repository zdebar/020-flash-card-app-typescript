import { User, UserLogin, UserSettings } from "../types/dataTypes";
import { Client } from "pg";
import logger from "../utils/logger.utils";

/**
 * Finds a user by their ID in the "users" table.
 * 
 * @param db The Postgres database client.
 * @param userId The ID of the user to find.
 * @returns The user if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByIdPostgres(db: Client, userId: number): Promise<User | null> {
  try {
    const res = await db.query("SELECT id, username, email, created_at FROM users WHERE id = $1", [userId]);
    if (!res?.rows?.length) return null;
    return res.rows[0];
  } catch (err: any) {
    logger.error(`Error querying user by ID: ${err.message}`);
    throw err;
  }
}

/**
 * Finds a user's preferences by their ID.
 * 
 * @param db The Postgres database client.
 * @param userId The ID of the user to find.
 * @returns The user's preferences if found, or null if no preferences exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserPreferencesByIdPostgres(db: Client, userId: number): Promise<UserSettings | null> {
  try {
    const res = await db.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.created_at, 
        up.* 
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.id = $1`,
    [userId]);

    if (!res?.rows?.length) return null;
    return res.rows[0];
  } catch (err: any) {
    logger.error(`Error querying user preferences for userId ${userId}: ${err.message}`);
    throw err;
  }
}

/**
 * Finds a user by their Username.
 * 
 * @param db The Postgres database client.
 * @param username The username of the user to find.
 * @returns The user if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByUsernamePostgres(db: Client, username: string): Promise<User | null> {
  try {
    const res = await db.query("SELECT id, username, email, created_at FROM users WHERE username = $1", [username]);
    if (!res?.rows?.length) return null;
    return res.rows[0];
  } catch (err: any) {
    logger.error(`Error querying user by Username: ${err.message}`);
    throw err;
  }
}

/**
 * Finds a user by their emails.
 * 
 * @param db The Postgres database client.
 * @param email The email of the user to find.
 * @returns The userloing (user with added attribute of hashedpassword) if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByEmailPostgres(db: Client, email: string): Promise<UserLogin | null> {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!res?.rows?.length) return null;
    return res.rows[0];
  } catch (err: any) {
    logger.error(`Error querying user by email: ${err.message}`);
    throw err;
  }
}

/**
 * Insert user into database.
 * 
 * @param db The Postgres database client.
 * @param username The usernam of the user to insert.
 * @param email The email of the user to insert.
 * @param hashedPassword The hashedpassord of the user to insert.
 * @returns Void
 * @throws Will throw an error if the database query fails.
 */
export async function insertUserPostgres(db: Client, username: string, email: string, hashedPassword: string): Promise<void> {
  try {
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
  } catch (err: any) {
    logger.error(`Error inserting user: ${err.message}`);
    throw err;
  }
}

