import db from "../config/database.config";
import { User, UserLogin} from "../types/dataTypes";

export async function findUserById(userId: number): Promise<UserLogin | null> {
  return new Promise<UserLogin | null>((resolve, reject) => {
    db.get(
      "SELECT id, username, email FROM users WHERE id = ?",
      [userId],
      (err, user) => {
        if (err) return reject(err);
        resolve(user as UserLogin ?? null);
      }
    );
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return new Promise<User | null>((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => { 
      if (err) return reject(err);
      resolve(user as User ?? null);
    });
  });
}

/**
 * Fetches a user from the database by their username.
 * Returns null if no user is found.
 * 
 * @param username - The username of the user to find.
 * @returns The user object if found, otherwise null.
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  return new Promise<User | null>((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (err) return reject(err);
      resolve(user as User ?? null);
    });
  });
}

export async function insertUser (username: string, email: string, hashedPassword: string): Promise<void>{
  return new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

/**
 * Helper function for running SELECT database queries
 */
export function queryDatabase<T>(query: string, params: any[]): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    db.all(query, params, (err, rows: T[]) => {
      if (err) {
        reject(new Error("Error querying database: " + err.message));
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Helper function for running INSERT, UPDATE, DELETE database queries
 */
export function executeQuery(query: string, params: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err: Error) {
      if (err) {
        reject(new Error("Error executing query: " + err.message));
      } else {
        resolve();
      }
    });
  });
}

