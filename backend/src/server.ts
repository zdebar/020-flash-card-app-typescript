import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "./routes/api.routes";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
import requestLoggerMiddleware from "./middlewares/requestLogger.middleware";
import "./config/config";
import { checkDatabaseConnection } from "./utils/database.utils";

const PORT = process.env.BACKEND_PORT || 3000;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
export const app = express();

// Middleware
app.use(requestLoggerMiddleware);
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: true,
  })
);

// Home route
app.get("/", (req, res) => {
  res.send("Server running!");
});

// Authentication Routes
app.use("/api", apiRouter);

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
