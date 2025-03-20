import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/auth.service";

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
