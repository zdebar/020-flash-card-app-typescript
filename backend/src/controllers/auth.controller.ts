import { Request, Response } from "express";
import { UserLogin } from "../types/dataTypes";
import { findUserById } from "../repository/user.repository";
import { registerUserService, loginUserService } from "../services/auth.service";
import logger from "../utils/logger";

export async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    const message = await registerUserService(username, email, password);
    res.status(201).json({ message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    const token = await loginUserService(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

/**
 * Finds user by ID, and res.json UserLogin (userID, username, email)
 */
export async function getUserProfile(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;

  try {
    const user: UserLogin = await findUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    logger.error("Database error during authentication:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
