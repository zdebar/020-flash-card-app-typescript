import logger from "../utils/logger.utils";
import { hashPassword, comparePasswords, createToken } from "../utils/auth.utils";
import { findUserByEmailPostgres, findUserByUsernamePostgres, insertUserPostgres } from "../repository/user.repository.postgres";
import { Client } from "pg";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/config";
import { UserError } from "../types/dataTypes";

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
 */
export async function registerUserServicePostgres(db: Client, username: string, email: string, password: string): Promise<void> {

  const existingEmail = await findUserByEmailPostgres(db, email);
  if (existingEmail) {
    throw new UserError("Email is already taken.");
  }

  const existingUsername = await findUserByUsernamePostgres(db, username);
  if (existingUsername) {
    throw new UserError("Username is already taken.");
  }
  
  const hashedPassword = await hashPassword(password);
  await insertUserPostgres(db, username, email, hashedPassword);  
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
 * @throws Error if the user doesn't exist or if the password is incorrect.
 */
export async function loginUserServicePostgres(
  db: Client,
  email: string,
  password: string,
): Promise<string> {
  const user = await findUserByEmailPostgres(db, email);
  if (!user) {
    throw new UserError("User doesn't exist.");
  }

  const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new UserError("Invalid password.");
    }
  
  const token = createToken(user, JWT_SECRET, JWT_EXPIRES_IN);
  return token;
}

