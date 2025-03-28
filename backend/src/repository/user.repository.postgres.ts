import { User, UserLogin, UserSettings, PostgresClient, UserError } from "../types/dataTypes";
import { QueryResult } from "pg";

/**
 * Finds a user by their ID in the "users" table.
 * 
 * @param db The Postgres database client.
 * @param userId The ID of the user to find.
 * @returns The user if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByIdPostgres(db: PostgresClient, userId: number): Promise<User | null> {
  const user: QueryResult<User> = await db.query("SELECT id, username, email FROM users WHERE id = $1", [userId]);  

  return user?.rows?.length ?  user.rows[0] : null;
}

/**
 * Finds a user's preferences by their ID.
 * 
 * @param db The Postgres database client.
 * @param userId The ID of the user to find.
 * @returns The user's preferences if found, or null if no preferences exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserPreferencesByIdPostgres(db: PostgresClient, userId: number): Promise<UserSettings | null> {
  const user: QueryResult<UserSettings> = await db.query(`
    SELECT 
      u.id, 
      u.username, 
      u.email, 
      up.* 
    FROM users u
    LEFT JOIN user_preferences up ON u.id = up.user_id
    WHERE u.id = $1`,
  [userId]);

  return user?.rows?.length ?  user.rows[0] : null;
}

/**
 * Finds a user by their Username.
 * 
 * @param db The Postgres database client.
 * @param username The username of the user to find.
 * @returns The user if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByUsernamePostgres(db: PostgresClient, username: string): Promise<User | null> {
  const user: QueryResult<User> = await db.query("SELECT id, username, email FROM users WHERE username = $1", [username]);

  return user?.rows?.length ?  user.rows[0] : null;
}

/**
 * Finds a user by their emails.
 * 
 * @param db The Postgres database client.
 * @param email The email of the user to find.
 * @returns The userloing (user with added attribute of hashedpassword) if found, or null if no user exist.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByEmailPostgres(db: PostgresClient, email: string): Promise<UserLogin | null> {
  const user: QueryResult<UserLogin> = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  return user?.rows?.length ?  user.rows[0] : null;
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
export async function insertUserPostgres(db: PostgresClient, username: string, email: string, hashedPassword: string): Promise<void> {
  try {
    await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, email, hashedPassword]);
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

