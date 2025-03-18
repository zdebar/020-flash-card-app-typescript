import sqlite3 from "sqlite3";
import logger from "../utils/logger";
import path from "path";

const dbPath = path.resolve(__dirname, "../../database.sqlite");

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    logger.error("Database connection failed:", err.message);
  } else {
    logger.debug("Connected to SQLite database.");
  }
});

export default db;
