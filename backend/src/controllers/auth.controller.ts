import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/user.service";
import db from "../config/database.config.postgres";
import logger from "../utils/logger.utils";
import { closeDbConnection } from "../utils/database.utils";

/**
 * Registers new user into database with username, email, password. Reads these from req.body. 
 * @param db used database
 * @returns 
 */
export async function registerUserController(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }
  
  try {
    await db.connect()
    await registerUserService(db, username, email, password);
    const token = await loginUserService(db, email, password);
    res.status(201).json({ message: "User registered successfully.", token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  } finally {
    await closeDbConnection(db)
  }
};

/**
 * Logins existing user with email, password. Reads these from req.body. 
 * @param db used database
 * @returns 
 */
export async function loginUserController(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    await db.connect()
    const token = await loginUserService(db, email, password);
    logger.info(`Sent token for: ${email}`);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  } finally {
    await closeDbConnection(db)
  }
};
