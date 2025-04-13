import winston, { format } from "winston";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const { json, timestamp, combine, errors } = format;
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

// Log file paths
const logDirectory = path.resolve("logs");
const logFile = path.join(logDirectory, "combined.log");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Logger format: timestamp and message
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
