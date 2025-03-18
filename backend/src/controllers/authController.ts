import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database";
import logger from "../utils/logger";
import { User } from "../types/dataTypes";

const SECRET_KEY = process.env.SECRET_KEY

// Register a new user
export const registerUser: RequestHandler = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const user = await new Promise<User | null>((resolve, reject) => {
      db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, user: User | null) => {
        if (err) reject(err);
        resolve(user);
      });
    });

    if (user) {
      return res.status(400).json({ error: "Username or email already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await new Promise<void>((resolve, reject) => {
      db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Send success response without returning a Response object
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    logger.error("Error during user registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login User
export async function loginUser(req: Request, res: Response): Promise<Response> {
  const { username, email, password } = req.body;

  // Check for missing credentials
  if (!password || (!username && !email)) {
    return res.status(400).json({ error: "Logging credentials incomplete." });
  }

  try {
    // Look for user in database
    const user = await new Promise<User | null>((resolve, reject) => {
      db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, user: User | null) => {
        if (err) {
          reject(new Error("Database error during user login"));
        } else {
          resolve(user);
        }
      });
    });

    if (!user) {
      return res.status(401).json({ error: "User doesn't exist." });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      SECRET_KEY, 
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    logger.error("Error during user login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
