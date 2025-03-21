import { User, UserLogin} from "../types/dataTypes";
import sqlite3 from "sqlite3";
import logger from "../utils/logger.utils";

/**
 * Finds a user by their ID in the "users" tables
 * @param db searched database
 * @param userId - searched user ID
 * @returns A Promise, resolves to a `UserLogin` object containing `id`, `username`, and `email` if found, or `null` if the user is not found.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserById(db: sqlite3.Database, userId: number): Promise<UserLogin | null> {
  return new Promise<UserLogin | null>((resolve, reject) => {
    db.get(
      "SELECT id, username, email FROM users WHERE id = ?",
      [userId],
      (err, user) => {
        if (err) {
          logger.error(`Error querying user by ID: ${err.message}`);
          reject(err);
        }
        resolve(user as UserLogin ?? null);
      }
    );
  });
}

/**
 * Finds a user by their "Email" in the "users" tables
 * @param db searched database
 * @param email - searched "Email"
 * @returns A Promise, resolves to a `User` object containing `id`, `username`, `email`, `password`, `created_at` if found, or `null` if the user is not found.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByEmail(db: sqlite3.Database, email: string): Promise<User | null> {
  return new Promise<User | null>((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => { 
      if (err) {
        logger.error(`Error querying user by email: ${err.message}`);
        reject(err);
      }
      resolve(user as User ?? null);
    });
  });
}

/**
 * Finds a user by their "Username" in the "users" tables
 * @param db searched database
 * @param username - searched "Username"
 * @returns A Promise, resolves to a `User` object containing `id`, `username`, `email`, `password`, `created_at` if found, or `null` if the user is not found.
 * @throws Will throw an error if the database query fails.
 */
export async function findUserByUsername(db: sqlite3.Database, username: string): Promise<User | null> {
  return new Promise<User | null>((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (err) {
        logger.error(`Error querying user by username: ${err.message}`);
        reject(err);
      }
      resolve(user as User ?? null);
    });
  });
}

/**
 * Insert user into "user" table.
 * @param db insertion database
 * @param username inserted to column "username"
 * @param email inserted to column "email"
 * @param hashedPassword inserted to column "pasword"
 * @returns A Promise, resolves to `void` return if insert succeeds.
 * @throws Will throw an error if the database error fails.
 */
export async function insertUser (db: sqlite3.Database, username: string, email: string, hashedPassword: string): Promise<void>{
  return new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err) => {
        if (err) {
          logger.error(`Error inserting user: ${err.message}`);
          reject(err);
        }
        resolve();
      }
    );
  });
};
