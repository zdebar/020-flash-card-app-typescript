import { User, UserLogin, UserSettings } from "../types/dataTypes";
import { Client } from "pg";
import logger from "../utils/logger.utils";

/**
 * Finds a user by their ID in the "users" table.
 * @param db - searched database
 * @param userId - searched user ID
 * @returns A Promise, resolves to a `User` with identification data / id, username, email, created_at
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByIdPostgres(db: Client, userId: number): Promise<User | null> {
  try {
    const res = await db.query("SELECT id, username, email, created_at FROM users WHERE id = $1", [userId]);
    if (!res) return null;
    return res.rows[0] || null;
  } catch (err: any) {
    logger.error(`Error querying user by ID: ${err.message}`);
    throw err;
  }
}

/**
 * Finds a user by their ID in the "users" table and includes user preferences from the "user_preferences" table.
 * @param db - searched database
 * @param userId - searched user ID
 * @returns A Promise, resolves to a `UserSettings` object with user identification data (`id`, `username`, `email`, `created_at`) and their preferences (`mode_day`, `font_size`, `notifications`).
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
        up.mode_day, 
        up.font_size, 
        up.notifications
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.id = $1
    `, [userId]);

    if (res.rows.length > 0) {
      const user = res.rows[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        mode_day: user.mode_day,
        font_size: user.font_size,
        notifications: user.notifications,
      };
    }

    return null; 
  } catch (err: any) {
    logger.error(`Error querying user with settings by ID: ${err.message}`);
    throw err;
  }
}

/**
 * Finds a user by their "Email" in the "users" table.
 * @param db - searched database
 * @param email - searched "Email"
 * @returns A Promise, resolves to a `UserLogin` object containing `id`, `username`, `email`, `password`, `created_at` if found, or `null` if the user is not found.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByEmailPostgres(db: Client, email: string): Promise<UserLogin | null> {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!res) return null;
    return res.rows[0] || null;
  } catch (err: any) {
    logger.error(`Error querying user by email: ${err.message}`);
    throw err;
  }
}

/**
 * Insert user into the "users" table.
 * @param db - insertion database
 * @param username - inserted to column "username"
 * @param email - inserted to column "email"
 * @param hashedPassword - inserted to column "password"
 * @returns A Promise, resolves to `void` return if insert succeeds.
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

