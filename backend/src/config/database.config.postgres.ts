import { Client } from "pg";

// PostgreSQL connection details
const postgresDB = new Client({
  host: "localhost", 
  port: 5432,        
  database: "postgres", 
  user: "postgres", 
  password: "mbc299748", 
});

export default postgresDB;