import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/user.service";
import db from "../config/database.config.postgres";
import logger from "../utils/logger.utils";
import { closeDbConnection } from "../utils/database.utils";
import { handleControllerError } from "../utils/validation.utils";

/**
 * Registers new user into database with username, email, password. Reads these from req.body. 
 * @param db used database
 * @returns 
 */
export async function registerUserController(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  // res.status(400).json({ error: "Sorry. So far application is closed to public users." });
  // return;

  if (!username || !email || !password) {
    res.status(400).json({ error: "Username, email and password are all required." });
    return;
  }  
  
  try {
    await db.connect()
    await registerUserService(db, username, email, password);
    const token = await loginUserService(db, email, password);
    res.status(201).json({ message: "User registered successfully.", token });
  } catch (err: any) {
    handleControllerError(err, res)
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
    handleControllerError(err, res)
  } finally {
    await closeDbConnection(db)
  }
};
