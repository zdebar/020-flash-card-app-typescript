import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import practiceRouter from "./routes/practice.routes";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
import requestLoggerMiddleware from "./middlewares/requestLogger.middleware";
import "./config/config";
import { checkDatabaseConnection } from "./utils/database.utils";
import path from "path";
import cookieParser from "cookie-parser";

const PORT = process.env.BACKEND_PORT || 3000;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
export const app = express();

// Middleware
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(requestLoggerMiddleware);

// Home route
app.get("/", (req, res) => {
  res.send("Server running!");
});

// Static files
app.use(
  "/audio",
  express.static(path.join(__dirname, "..", "..", "public", "audio"))
);

// Authentication Routes
app.use("/user", userRouter);

// Protected Route
app.use("/practice", practiceRouter);

// Error Handling Middleware
app.use(errorHandlerMiddleware);

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
