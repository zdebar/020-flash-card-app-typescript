import { Client } from "pg";

// PostgreSQL connection details
const postgresDBTest = new Client({
  host: "localhost", 
  port: 5432,        
  database: "postgres", 
  user: "postgres", 
  password: "mbc299748", 
});

export default postgresDBTest;