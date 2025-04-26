import winston, { format } from "winston";
import path from "path";
import dotenv from "dotenv";

const { json, timestamp, combine } = format;
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

// Logger format: timestamp and message
const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/app.log"),
    }),
  ],
});

export default logger;
