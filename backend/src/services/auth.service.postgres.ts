import logger from "../utils/logger.utils";
import { hashPassword, comparePasswords, createToken } from "../utils/auth.utils";
import { findUserByEmailPostgres, findUserByUsernamePostgres, insertUserPostgres } from "../repository/user.repository.postgres";
import { Client } from "pg";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/config";

/**
 * Registers a new user into the database table "users".
 * First, checks if the username or email are already in use. 
 * Then, hashes the password (bcrypt) and inserts the user into the database. 
 * 
 * @param db The database client.
 * @param username The username to register. Must be unique.
 * @param email The email to register. Must be unique.
 * @param password The password to register. Will be hashed. * 
 * @throws Error if the email or username is already taken.
 * @throws Error if there is any issue during user registration.
 */
export async function registerUserServicePostgres(db: Client, username: string, email: string, password: string): Promise<void> {
  // Check if email already exists
  const existingEmail = await findUserByEmailPostgres(db, email);
  if (existingEmail) {
    throw new Error("Email is already taken.");
  }
  // Check if username already exists
  const existingUsername = await findUserByUsernamePostgres(db, username);
  if (existingUsername) {
    throw new Error("Username is already taken.");
  }

  try {
    

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
    await insertUserPostgres(db, username, email, hashedPassword);
    logger.info(`User registered successfully: ${username}`); 
  } catch (err: any) {
    const errorMsg = `Error during user registration: ${err.message}`
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Logs in a user by email.
 * 
 * First, it checks for the existence of the user by email. If the user exists, it compares the provided password with the hashed password stored in the database. 
 * If the password matches, it creates and returns a JWT token for authentication.
 * 
 * @param db The database client used to query the database.
 * @param email The email of the user attempting to log in.
 * @param password The password provided by the user.
 * @returns A promise that resolves to the JWT access token.
 * @throws Error if the user doesn't exist or if the password is incorrect or if database query fails.
 */
export async function loginUserServicePostgres(
  db: Client,
  email: string,
  password: string,
): Promise<string> {
  try {
    // Find user by email
    const user = await findUserByEmailPostgres(db, email);
    if (!user) {
      throw new Error("User doesn't exist.");
    }

    // Compare password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password.");
    }

    // Create JWT token
    const token = createToken(user, JWT_SECRET, JWT_EXPIRES_IN);
    return token;
  } catch (err: any) {
    const errorMsg = `Error during user login: ${err.message}`
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}

