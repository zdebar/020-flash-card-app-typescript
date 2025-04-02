import { Client, Pool } from "pg";

export interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  progress: number;
  learned_at: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserLogin extends User {
  created_at: string; // ISO 8601 string
  password: string;
}

export interface UserPreferences extends User {
  mode_day: number;
  font_size: number;
  notifications: number;
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export type PostgresClient = Pick<Client | Pool, "query" | "connect" | "end">;
