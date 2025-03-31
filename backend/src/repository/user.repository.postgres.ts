import {
  User,
  UserLogin,
  UserPreferences,
  PostgresClient,
  UserError,
} from "../types/dataTypes";
import { QueryResult } from "pg";

/**
 * Finds a user by their ID in a PostgreSQL database.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param userId - The ID of the user to be retrieved.
 * @returns A promise that resolves to the user object containing `id`, `username`, and `email`.
 * @throws An error if no user is found with the given ID.
 */
export async function findUserByIdPostgres(
  db: PostgresClient,
  userId: number
): Promise<User> {
  const user: QueryResult<User> = await db.query(
    "SELECT id, username, email FROM users WHERE id = $1",
    [userId]
  );

  if (!user.rows.length) {
    throw new Error(`User ${userId} not found.`);
  }
  return user.rows[0];
}

/**
 * Retrieves the user preferences for a specific user by their ID from a PostgreSQL database.
 * In case relevant user preferences are not found, it returns the default values.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param userId - The unique identifier of the user whose preferences are being retrieved.
 * @returns A promise that resolves to the user's preferences.
 * @throws Will throw an error if no user with the specified ID is found.
 */
export async function findUserPreferencesByIdPostgres(
  db: PostgresClient,
  userId: number
): Promise<UserPreferences> {
  const user: QueryResult<UserPreferences> = await db.query(
    `
    SELECT 
      u.id, 
      u.username, 
      u.email, 
      COALESCE(up.mode_day, 1) AS mode_day, 
      COALESCE(up.font_size, 2) AS font_size,
      COALESCE(up.notifications, 1) AS notifications
    FROM users u
    LEFT JOIN user_preferences up ON u.id = up.user_id
    WHERE u.id = $1`,
    [userId]
  );

  if (!user.rows.length) {
    throw new Error(`User ${userId} not found.`);
  }
  return user.rows[0];
}

/**
 * Finds a user by their username in a PostgreSQL database.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param username - The username of the user to search for.
 * @returns A promise that resolves to the user object containing `id`, `username`, and `email`.
 * @throws An error if no user with the specified username is found.
 */
export async function findUserByUsernamePostgres(
  db: PostgresClient,
  username: string
): Promise<User> {
  const user: QueryResult<User> = await db.query(
    "SELECT id, username, email FROM users WHERE username = $1",
    [username]
  );

  if (!user.rows.length) {
    throw new Error(`Username ${username} not found.`);
  }
  return user.rows[0];
}

/**
 * Finds a user by their email. This function is used for login and returns full user information, including the hashed password.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param email - The email of the user to find.
 * @returns The user login object (user with an additional hashed password attribute) if found.
 * @throws Will throw a UserError if no user exists with the specified email.
 */
export async function findUserByEmailPostgres(
  db: PostgresClient,
  email: string
): Promise<UserLogin> {
  const user: QueryResult<UserLogin> = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (!user.rows.length) {
    throw new UserError(`User with email: ${email} does not exist!`);
  }
  return user.rows[0];
}

/**
 * Inserts a new user into the PostgreSQL database.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param username - The username of the new user.
 * @param email - The email address of the new user.
 * @param hashedPassword - The hashed password of the new user.
 * @returns A promise that resolves when the user is successfully inserted.
 * @throws {UserError} If the username or email is already taken.
 * @throws {Error} If any other database error occurs.
 */
export async function insertUserPostgres(
  db: PostgresClient,
  username: string,
  email: string,
  hashedPassword: string
): Promise<void> {
  try {
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
  } catch (err: any) {
    if (err.code === "23505") {
      if (err.detail.includes("username")) {
        throw new UserError("Username is already taken.");
      } else if (err.detail.includes("email")) {
        throw new UserError("Email is already taken.");
      }
    }
    throw err;
  }
}
