import {
  hashPassword,
  comparePasswords,
  createToken,
} from "../utils/auth.utils";
import {
  insertUserPostgres,
  findUserLoginByEmailPostgres,
  findUserPreferencesByIdPostgres,
} from "../repository/user.repository.postgres";
import { UserError, User, PostgresClient } from "../types/dataTypes";

/**
 * Registers a new user in the system by hashing the provided password
 * and inserting the user details into the PostgreSQL database.
 *
 * @param db - The PostgreSQL client instance used to interact with the database.
 * @param username - The username of the new user.
 * @param email - The email address of the new user.
 * @param password - The plaintext password of the new user, which will be hashed before storage.
 * @returns A promise userID / Error
 */
export async function registerUserService(
  db: PostgresClient,
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const hashedPassword = await hashPassword(password);
  const user = await insertUserPostgres(db, username, email, hashedPassword);

  const token = createToken(user.id);
  return { token, user };
}

/**
 * Authenticates a user by verifying their email and password, and generates a JWT token upon successful login.
 *
 * @param db - The Postgres client instance used to query the database.
 * @param email - The email address of the user attempting to log in.
 * @param password - The plaintext password provided by the user for authentication.
 * @returns A promise that resolves to a JWT token string if authentication is successful.
 * @throws {UserError} If the provided password does not match the stored password for the user.
 */
export async function loginUserService(
  db: PostgresClient,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const userLogin = await findUserLoginByEmailPostgres(db, email);
  const passwordMatch = await comparePasswords(password, userLogin.password);

  if (!passwordMatch) {
    throw new UserError("Zadané heslo je nesprávné");
  }

  const token = createToken(userLogin.id);
  const { password: passwordToOmit, email: emailToOmit, ...user } = userLogin;

  return { token, user };
}

/**
 * Retrieves the user preferences for a given user ID from the database.
 *
 * @param db - The Postgres client instance used to query the database.
 * @param email - The unique identifier of the user whose preferences are being retrieved.
 * @returns A promise that resolves to the user's preferences.
 */
export async function getUserPreferences(
  db: PostgresClient,
  userId: number
): Promise<User> {
  return await findUserPreferencesByIdPostgres(db, userId);
}
