import db from "../config/database";
import { User, UserLogin, WordData } from "../types/dataTypes";

export async function findUserById(userId: number): Promise<UserLogin | null> {
  return new Promise<UserLogin | null>((resolve, reject) => {
    db.get(
      "SELECT id, username, email FROM users WHERE id = ?",
      [userId],
      (err, user: UserLogin) => {
        if (err) return reject(err);
        resolve(user ?? null);
      }
    );
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return new Promise<User | null>((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user: User | undefined) => { // fucken undefined here, should there be null also
      if (err) return reject(err);
      resolve(user ?? null);
    });
  });
}

export async function findUserByUsername(username: string): Promise<User | null> {
  return new Promise<User | null>((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user: User | undefined) => {
      if (err) return reject(err);
      resolve(user ?? null);
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

