import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import errorHandler from "./middlewares/errorHandler.middleware";
import { requestLogger } from "./utils/logger.utils";

const PORT = process.env.BACKEND_PORT;
export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Home route
app.get("/", (req, res) => {
  res.send("Server running!");
});

// Authentication Routes
app.use("/auth", authRoutes);

// Protected Route
app.use("/user", userRouter);

// Error Handling Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
