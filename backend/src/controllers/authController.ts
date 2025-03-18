import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

// Register a new user
export function registerUser (req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, user) => {
    if (user) {
      return res.status(400).json({ error: "Username or email already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
      [username, email, hashedPassword], 
      function (err) {
        if (err) return res.status(500).json({ error: "Database error" });

        res.status(201).json({ message: "User registered successfully!" });
      }
    );
  });
};

// Login User
export function loginUser (req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res.status(400).json({ error: "Username or email and password required." });
  }

  db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
};
