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
  czech: string;
  english: string;
  pronunciation: string | null;
  audio: string | null;
  started: boolean;
  learned: boolean;
}

export interface WordOverview extends WordUpdate {
  czech: string;
  english: string;
  pronunciation: string | null;
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

export interface User {
  id: number;
  username: string;
}

export interface UserLogin extends User {
  hashed_password: string;
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
  cefr_level: string; // CEFR level (A1, A2, B1, B2, C1, C2)
  startedCountToday: number; // Number of words started today
  startedCount: number; // Number of words started (not today)
  learnedCountToday: number; // Number of words learned today
  learnedCount: number; // Number of words learned (not today)
  masteredCountToday: number; // Number of words mastered today
  masteredCount: number; // Number of words mastered (not today)
  Count: number; // Number of words by cefr_level
}
