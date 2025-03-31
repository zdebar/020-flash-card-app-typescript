import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRouter from "./routes/user.routes";

export const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Server running!");
});

// Authentication Routes
app.use("/auth", authRoutes);

// Protected Route
app.use("/user", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
