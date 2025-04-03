import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import errorHandler from "./middlewares/errorHandler.middleware";
import { requestLogger } from "./utils/logger.utils";
import "./config/config";
import { checkDatabaseConnection } from "./utils/database.utils";

const PORT = process.env.BACKEND_PORT || 3000;
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
app.use("/auth", authRouter);

// Protected Route
app.use("/user", userRouter);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
startServer();

// Function to start the server
async function startServer(): Promise<void> {
  try {
    await checkDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error("Failed to start the server:", err.message);
    process.exit(1);
  }
}
