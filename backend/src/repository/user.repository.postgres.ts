import logger from "../utils/logger.utils";
import { UserLogin, User, UserError, PostgresClient } from "../types/dataTypes";
import { QueryResult } from "pg";
import { withDbClient } from "../utils/database.utils";

/**
 * Checks if a user exists in the database.
 *
 * @throws Error if the user does not exist.
 */
export async function checkUserExistsById(
  db: PostgresClient,
  userId: number
): Promise<void> {
  const userCheckQuery = `SELECT 1 FROM users WHERE id = $1`;

  await withDbClient(db, async (client) => {
    const userCheckResult = await client.query(userCheckQuery, [userId]);
    if (userCheckResult.rowCount === 0) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }
  });
}

/**
 * Finds User by userID.
 */
export async function findUserByIdPostgres(
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
 * @returns {Promise<User>} The newly created user object.
 * @throws {UserError} If the username or email is already taken. Specifies the error message for user feedback.
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

/**
 * Gets count of learned and mastered words for a user.
 */
export async function getUserScore(
  db: PostgresClient,
  userId: number
): Promise<{ learnedWords: number; masteredWords: number }> {
  const query = `
    SELECT 
      COUNT(CASE WHEN learned_at IS NOT NULL THEN 1 END) AS learned_words,
      COUNT(CASE WHEN mastered_at IS NOT NULL THEN 1 END) AS mastered_words
    FROM user_words
    WHERE user_id = $1;
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [userId]);
    const { learned_words, mastered_words } = result.rows[0];

    return {
      learnedWords: parseInt(learned_words, 10),
      masteredWords: parseInt(mastered_words, 10),
    };
  });
}
