import {
  hashPassword,
  comparePasswords,
  createToken,
} from "../utils/auth.utils";
import {
  findUserByEmailPostgres,
  findUserPreferencesByIdPostgres,
  insertUserPostgres,
} from "../repository/user.repository.postgres";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/config";
import { UserError, UserPreferences, PostgresClient } from "../types/dataTypes";

/**
 * Registers a new user into the database table "users". Throws UserError on failed to insert due to uniqueness fail.
 *
 * @param db The database client.
 * @param username The username to register. Must be unique.
 * @param email The email to register. Must be unique.
 * @param password The password to register. Will be hashed. *
 */
export async function registerUserService(
  db: PostgresClient,
  username: string,
  email: string,
  password: string
): Promise<void> {
  const hashedPassword = await hashPassword(password);
  await insertUserPostgres(db, username, email, hashedPassword);
}

/**
 * Logs in a user by email.
 *
 * First, it checks for the existence of the user by email. Throws UserError when user doesn´t exists.
 * If the user exists, it compares the provided password with the hashed password stored in the database.
 * If the password matches, it creates and returns a JWT token for authentication.
 *
 * @param db The database client used to query the database.
 * @param email The email of the user attempting to log in.
 * @param password The password provided by the user.
 * @returns A promise that resolves to the JWT access token.
 * @throws Error if the user doesn't exist or if the password is incorrect.
 */
export async function loginUserService(
  db: PostgresClient,
  email: string,
  password: string
): Promise<string> {
  const user = await findUserByEmailPostgres(db, email);
  const passwordMatch = await comparePasswords(password, user.password);

  if (!passwordMatch) {
    throw new UserError("Invalid password.");
  }

  const token = createToken(user, JWT_SECRET, JWT_EXPIRES_IN);
  return token;
}

/**
 *
 * @param db The database client used to query the database.
 * @param userId Searched ID
 * @returns UserPreference or null
 */
export async function getUserPreferences(
  db: PostgresClient,
  userId: number
): Promise<UserPreferences> {
  return await findUserPreferencesByIdPostgres(db, userId);
}
