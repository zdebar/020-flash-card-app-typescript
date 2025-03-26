import { Client } from "pg";
import logger from "../utils/logger.utils";

// PostgreSQL connection details
const client = new Client({
  host: "localhost", 
  port: 5432,        
  database: "postgres", 
  user: "zdebar", 
  password: "mbc299748", 
});

client.connect((err) => {
  if (err) {
    logger.error("Database connection failed:", err.message);
  } else {
    logger.debug("Connected to PostgreSQL database.");
  }
});

export default client;
