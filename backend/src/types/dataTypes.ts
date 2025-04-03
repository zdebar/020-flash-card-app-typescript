import { Client, Pool } from "pg";

export type PostgresClient = Pick<Client | Pool, "query" | "connect" | "end">;
