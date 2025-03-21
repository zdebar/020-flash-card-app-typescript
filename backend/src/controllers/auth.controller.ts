import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/auth.service";
import sqlite3 from "sqlite3";

/**
 * Registers new user into database with username, email, password. Reads these from req.body. 
 * @param db used database
 * @returns 
 */
export function registerUserController(db: sqlite3.Database) {
  return async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    try {
      await registerUserService(db, username, email, password);
      const token = await loginUserService(db, email, password);
      res.status(201).json({ message: "User registered successfully.", token });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}

/**
 * Logins existing user with email, password. Reads these from req.body. 
 * @param db used database
 * @returns 
 */
export function loginUserController(db: sqlite3.Database) {
  return async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    try {
      const token = await loginUserService(db, email, password);
      res.json({ token });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  };
}
