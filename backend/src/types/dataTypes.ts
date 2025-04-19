import { Client, Pool } from "pg";

// Database Client Type
export type PostgresClient = Pick<Client | Pool, "query" | "connect" | "end">;

// Word Note Data Types
export interface Note {
  user_id: number;
  word_id: number;
  note: string;
}

// Word Data Types
export interface WordUpdate {
  id: number;
  progress: number;
}

export interface Word extends WordUpdate {
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  started: boolean;
  learned: boolean;
}

export interface WordOverview extends WordUpdate {
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  learned_at: string | null;
  mastered_at: string | null;
}

// User Data Types
export enum ModeDay {
  DEFAULT = "default",
  LIGHT = "light",
  DARK = "dark",
}

export enum FontSize {
  SMALL = "small",
  NORMAL = "normal",
  LARGE = "large",
}

export interface UserID {
  id: number;
}

export interface User extends UserID {
  username: string;
  mode_day: ModeDay;
  font_size: FontSize;
  notifications: boolean;
  languages: string[];
}

export interface UserLogin extends User {
  password: string;
}

// Error Data Types
export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

// Score Data Types
export interface Score {
  learnedCount: number;
  masteredCount: number;
}
