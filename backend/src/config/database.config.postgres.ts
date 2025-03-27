import { Client } from "pg";
import logger from "../utils/logger.utils";

// PostgreSQL connection details
const client = new Client({
  host: "localhost", 
  port: 5432,        
  database: "postgres", 
  user: "postgres", 
  password: "mbc299748", 
});

export default client.connect((err) => {
  if (err) {
    logger.error("Database connection failed:", err.message);
  } else {
    logger.debug("Connected to PostgreSQL database.");
  }
});