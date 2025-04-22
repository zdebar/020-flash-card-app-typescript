import { Client, Pool } from "pg";

// Database Client Type
export type PostgresClient = Pick<Client | Pool, "query" | "connect" | "end">;
