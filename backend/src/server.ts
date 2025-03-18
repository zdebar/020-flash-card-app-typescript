import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middlewares/authMiddleware";
import { getUserProfile } from './controllers/databaseHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/auth", authRoutes);

// Protected Route
app.get("/profile", authenticateToken, getUserProfile);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
