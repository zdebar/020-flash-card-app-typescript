import { UserLogin, User, UserError, PostgresClient } from "../types/dataTypes";
import { QueryResult } from "pg";
import { PoolClient } from "pg";

/**
 * Retrieves the user preferences for a specific user by their ID from a PostgreSQL database.
 * In case relevant user preferences are not found, it returns the default values.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param email - The unique identifier of the user whose preferences are being retrieved.
 * @returns A promise that resolves to the user's preferences.
 * @throws Will throw an error if no user with the specified ID is found.
 */
export async function findUserPreferencesByIdPostgres(
  db: PostgresClient,
  userId: number
): Promise<User> {
  const client = (await db.connect()) as PoolClient;

  try {
    const user: QueryResult<User> = await db.query(
      `
      SELECT 
        u.id,
        u.username, 
        COALESCE(up.mode_day, 1) AS mode_day, 
        COALESCE(up.font_size, 2) AS font_size,
        COALESCE(up.notifications, 1) AS notifications
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.id = $1`,
      [userId]
    );

    if (!user.rows.length) {
      throw new Error(`User not found!`);
    }
    return user.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Finds a user by their email. This function is used for login and returns full user information, including the hashed password.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param email - The email of the user to find.
 * @returns The user login object (user with an additional hashed password attribute) if found.
 * @throws Will throw a UserError if no user exists with the specified email.
 */
export async function findUserLoginByEmailPostgres(
  db: PostgresClient,
  email: string
): Promise<UserLogin> {
  const client = (await db.connect()) as PoolClient;

  try {
    const user: QueryResult<UserLogin> = await db.query(
      `
      SELECT 
        u.id,
        u.username, 
        u.email, 
        u.password,
        COALESCE(up.mode_day, 1) AS mode_day, 
        COALESCE(up.font_size, 2) AS font_size,
        COALESCE(up.notifications, 1) AS notifications
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.email = $1`,
      [email]
    );

    if (!user.rows.length) {
      throw new UserError(`Uživatel nebyl nalezen!`);
    }
    return user.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Inserts a new user into the PostgreSQL database along with their default preferences.
 *
 * @param db - The PostgreSQL client instance used to connect to the database.
 * @param username - The username of the new user.
 * @param email - The email address of the new user.
 * @param hashedPassword - The hashed password of the new user.
 * @returns A promise that resolves when the user and their preferences are successfully inserted.
 * @throws {UserError} If the username or email is already taken.
 * @throws {Error} If any other database error occurs during the operation.
 *
 */
export async function insertUserPostgres(
  db: PostgresClient,
  username: string,
  email: string,
  hashedPassword: string
): Promise<User> {
  const client = (await db.connect()) as PoolClient;
  const defaultModeDay = 1;
  const defaultFontSize = 2;
  const defaultNotifications = 1;

  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username",
      [username, email, hashedPassword]
    );
    let user = userResult.rows[0];
    await client.query(
      "INSERT INTO user_preferences (user_id, mode_day, font_size, notifications) VALUES ($1, $2, $3, $4)",
      [user.id, defaultModeDay, defaultFontSize, defaultNotifications]
    );
    await client.query("COMMIT");
    return {
      id: user.id,
      username: user.username,
      mode_day: defaultModeDay,
      font_size: defaultFontSize,
      notifications: defaultNotifications,
    };
  } catch (err: any) {
    await client.query("ROLLBACK");
    // TODO: More limits on username and email in database now, but not in the code
    if (err.code === "23505") {
      if (err.detail.includes("username")) {
        throw new UserError("Uživatelské jméno je již obsazeno.");
      } else if (err.detail.includes("email")) {
        throw new UserError("Email je již obsazen.");
      }
    }
    throw err;
  } finally {
    client.release();
  }
}
