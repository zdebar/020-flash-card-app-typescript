import winston from "winston";
import path from "path";
import fs from "fs";

const loggerLevel: string = process.env.LOGGER_LEVEL || "error";

// silent     Logger Off
// error	  0	Serious problems (e.g., database failure)
// warn	    1	Warning (e.g., API rate limits approaching)
// info	    2	General information (e.g., server started)
// http	    3	HTTP requests logging
// verbose	4	Detailed logs
// debug	  5	Debugging info (e.g., function calls, variables)
// silly	  6	Super detailed logs (rarely used)

// Log file paths
const logDirectory = path.resolve("logs"); 
const debugLogFile = path.join(logDirectory, "debug.log");
const infoLogFile = path.join(logDirectory, "info.log"); 
const errorLogFile = path.join(logDirectory, "error.log");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logger = winston.createLogger({
  level: loggerLevel, 
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: debugLogFile, level: "debug" }),
    new winston.transports.File({ filename: infoLogFile, level: "info" }),
    new winston.transports.File({ filename: errorLogFile, level: "error" }),

  ],
});

export default logger;

// Logger usage example
// logger.info(`User created with username: ${username}`);
