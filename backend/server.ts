import express, { request, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from "./src/routes/authRoutes";
import { authenticateToken } from "./src/middlewares/authMiddleware";
import db from "./src/config/database";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/auth", authRoutes);

// Protected Route
app.get("/profile", authenticateToken, (req, res) => {
  db.get("SELECT id, username, email, created_at FROM users WHERE id = ?", [(req as any).user.id], (err, user) => {
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
