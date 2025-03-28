import { Client } from "pg";
import logger from "../utils/logger.utils";

// PostgreSQL connection details
const postgresDB = new Client({
  host: "localhost", 
  port: 5432,        
  database: "postgres", 
  user: "postgres", 
  password: "mbc299748", 
});

postgresDB.connect((err) => {
  if (err) {
    logger.error("Database connection failed:", err.message);
  } else {
    logger.debug("Connected to PostgreSQL database.");
  }
});

export default postgresDB;