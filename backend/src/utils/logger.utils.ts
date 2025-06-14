import winston, { format } from "winston";
import path from "path";
import dotenv from "dotenv";
import DailyRotateFile from "winston-daily-rotate-file";

const { json, timestamp, combine, colorize, printf, simple } = format;
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const logDir = path.join(__dirname, "../../logs");

// Custom format for console in development
const devFormat = combine(
  colorize(),
  timestamp(),
  printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  })
);

// File transport with daily rotation
const fileTransport = new DailyRotateFile({
  filename: path.join(logDir, "%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: process.env.LOGGER_LEVEL || "info",
  format: combine(timestamp(), json()),
});

const isProduction = process.env.NODE_ENV === "production";

const transports: winston.transport[] = [fileTransport];

if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      format: devFormat, // Use the same format for console logging
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || "info",
  transports,
  exitOnError: false,
});

/**
 * Custom logging function to include function name, parameters, and extra metadata.
 */
export function logErrorWithDetails(
  error: Error | any,
  functionName: string,
  params: Record<string, unknown> = {},
  meta: Record<string, unknown> = {}
): void {
  logger.error({
    message: error?.message || String(error),
    // stack: error?.stack,
    ...meta,
  });
}

export default logger;
