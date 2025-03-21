import logger from "../utils/logger.utils";
import { hashPassword, comparePasswords, createToken } from "../utils/auth.utils";
import { findUserByEmail, findUserByUsername, insertUser } from "../repository/user.repository";
import sqlite3 from "sqlite3";

/**
 * Register new user into database table users.
 * First check if username or email are not already used. Then hashes password (bcrypt) and inserts user into database. 
 * @param db user databae
 * @param username register username, must be unique
 * @param email register email, must be unique
 * @param password register password
 */
export async function registerUserService(db: sqlite3.Database, username: string, email: string, password: string): Promise<void> {
  try {
    // Check if email already exists
    const existingEmail = await findUserByEmail(db, email);
    if (existingEmail) {
      throw new Error("Email is already taken.");
    }

    // Check if username already exists
    const existingUsername = await findUserByUsername(db, username);
    if (existingUsername) {
      throw new Error("Username is already taken.");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
    await insertUser(db, username, email, hashedPassword);
    logger.info(`User registered successfully: ${username}`); 
  } catch (err: any) {
    logger.error("Error during user registration:", err);
    throw new Error(err.message); 
  }
}

/**
 * Logins user by email.
 * First checks for existence of user by email. If does compares password with hashed one (bcrypt) in database. 
 * Creates and returns JWT token.
 * @param db used database
 * @param email login email
 * @param password login password
 * @returns JWT access token, Expiration time of token si defined in .env as JWT_EXPIRES_IN.
 */
export async function loginUserService(db: sqlite3.Database, email: string, password: string): Promise<string> {
  try {
    // Find user by email
    const user = await findUserByEmail(db, email);
    if (!user) {
      throw new Error("User doesn't exist.");
    }

    // Compare password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password.");
    }

    // Create JWT token
    const token = createToken(user);    
    return token;
  } catch (err: any) {
    logger.error("Error during user login:", err);
    throw new Error(err.message); 
  }
}
