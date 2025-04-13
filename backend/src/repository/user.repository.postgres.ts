import logger from "../utils/logger.utils";
import { UserLogin, User, UserError, PostgresClient } from "../types/dataTypes";
import { QueryResult } from "pg";
import { withDbClient } from "../utils/database.utils";

/**
 * Finds User by userID.
 */
export async function findUserPreferencesByIdPostgres(
  db: PostgresClient,
  userId: number
): Promise<User> {
  return withDbClient(db, async (client) => {
    const user: QueryResult<User> = await client.query(
      `
      SELECT 
        id,
        username, 
        mode_day,
        font_size,
        notifications
      FROM users
      WHERE id = $1`,
      [userId]
    );

    if (!user.rows.length) {
      throw new Error(`User with id ${userId} not found!`);
    }
    return user.rows[0];
  });
}

/**
 * Finds a user by their email. INCLUDES HASHED PASSWORD!
 *
 * @throws Will throw a UserError if no user exists with the specified email.
 */
export async function findUserLoginByEmailPostgres(
  db: PostgresClient,
  email: string
): Promise<UserLogin> {
  return withDbClient(db, async (client) => {
    const user: QueryResult<UserLogin> = await client.query(
      `
      SELECT 
        id,
        username, 
        email, 
        password,
        mode_day, 
        font_size,
        notifications
      FROM users
      WHERE email = $1`,
      [email]
    );

    if (!user.rows.length) {
      throw new UserError(`Uživatel nebyl nalezen!`);
    }
    return user.rows[0];
  });
}

/**
 * Inserts a new user into the PostgreSQL database along with their default preferences.
 *
 * @throws {UserError} If the username or email is already taken.
 * @throws {Error} Any other error.
 *
 */
export async function insertUserPostgres(
  db: PostgresClient,
  username: string,
  email: string,
  hashedPassword: string
): Promise<User> {
  return withDbClient(db, async (client) => {
    try {
      const user = await client.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, mode_day, font_size, notifications",
        [username, email, hashedPassword]
      );

      return user.rows[0];
    } catch (err: any) {
      if (err.code === "23505") {
        if (err.detail.includes("username")) {
          throw new UserError("Uživatelské jméno je již obsazeno.");
        } else if (err.detail.includes("email")) {
          throw new UserError("Email je již obsazen.");
        }
        logger.error("Unexpected error: ", err.detail);
      }
      throw err;
    }
  });
}
