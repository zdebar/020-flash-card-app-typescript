import sqlite3 from "sqlite3";
import logger from "../utils/logger";

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    logger.error("Database connection failed:", err.message);
  } else {
    logger.error("Connected to SQLite database.");
  }
});

export default db;
