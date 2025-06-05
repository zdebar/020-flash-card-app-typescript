import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import apiRouter from "./routes/api.routes";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
import requestLoggerMiddleware from "./middlewares/requestLogger.middleware";
import "./config/config";
import { checkDatabaseConnection } from "./utils/database.utils";

const PORT = process.env.PORT || process.env.BACKEND_PORT || 3000;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
export const app = express();

// Trust proxy setting
app.set("trust proxy", 1); // Trust the first proxy

// Middleware
app.use(requestLoggerMiddleware);

// Rate limiting middleware (e.g., 100 requests per 15 minutes per IP)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.raw({ type: "application/octet-stream", limit: "1mb" }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted.cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://your-image-cdn.com"],
        connectSrc: ["'self'", "https://api.yourdomain.com"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: true,
    referrerPolicy: { policy: "no-referrer" },
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
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
