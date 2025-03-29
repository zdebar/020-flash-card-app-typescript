import {
  User,
  UserLogin,
  UserPreferences,
  PostgresClient,
  UserError,
} from "../types/dataTypes";
import { QueryResult } from "pg";

/**
 * Finds a user by their ID in the "users" table.
 *
 * @param db The Postgres database client.
 * @param userId The ID of the user to find.
 * @returns The user if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
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
    throw new Error(`User ${userId} not found in database: ${db}`);
  }
  return user.rows[0];
}

/**
 * Finds a user's preferences by their ID.
 *
 * @param db The Postgres database client.
 * @param userId The ID of the user to find.
 * @returns The user's preferences if found, or null if no preferences exist.
 * @throws Will throw an error if the database query fails.
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
      up.* 
    FROM users u
    LEFT JOIN user_preferences up ON u.id = up.user_id
    WHERE u.id = $1`,
    [userId]
  );

  if (!user.rows.length) {
    throw new Error(`User ${userId} not found in database: ${db}`);
  }
  return user.rows[0];
}

/**
 * Finds a user by their Username.
 *
 * @param db The Postgres database client.
 * @param username The username of the user to find.
 * @returns The user if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
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
    throw new Error(`Username ${username} not found in database: ${db}`);
  }
  return user.rows[0];
}

/**
 * Finds a user by their emails. This function servers for login return full User info including hashed password.
 *
 * @param db The Postgres database client.
 * @param email The email of the user to find.
 * @returns The userloing (user with added attribute of hashedpassword) if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
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
    throw new UserError(`User email: ${email} doesnt exists!`);
  }
  return user.rows[0];
}

/**
 * Insert user into database. Sends specific UserError if username or email is already used.
 *
 * @param db The Postgres database client.
 * @param username The usernam of the user to insert.
 * @param email The email of the user to insert.
 * @param hashedPassword The hashedpassord of the user to insert.
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
