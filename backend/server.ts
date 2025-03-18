import express, { request, Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from "bcryptjs"
import { Jwt } from 'jsonwebtoken';
import registerUser from './src/userFunctions';

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database("./src/data/dictionary.db")

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ id: "1", email: "test@email.com", name: "Test User"});
});

app.use('/api',);

app.post("/register", registerUser(req: request db) );

app.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res.status(400).json({ error: "Username or email and password required." });
  }

  // Check if user exists using either username or email
  db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

app.get("/profile", authenticateToken, (req, res) => {
  db.get("SELECT id, username, email, created_at FROM users WHERE id = ?", [req.user.id], (err, user) => {
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
