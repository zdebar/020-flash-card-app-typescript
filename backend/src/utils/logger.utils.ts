import winston, { format } from "winston";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

const { json, timestamp, combine, errors } = format;
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

// Log file paths
const logDirectory = path.resolve("logs");
const logFile = path.join(logDirectory, "combined.log");

// Ensure logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Simplified logger format: timestamp and message only
const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || "debug",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFile }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: logFile })],
  rejectionHandlers: [new winston.transports.File({ filename: logFile })],
});

export default logger;

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { method, url } = req;
  const startTime = Date.now();

  // Log the request details
  logger.info(`Incoming request: ${method} ${url}`);

  // Log the response details after the request is handled
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.info(
      `Response: ${method} ${url} ${res.statusCode} - ${responseTime}ms`
    );
  });

  next();
}
