import { Client, Pool } from "pg";

export type PostgresClient = Pick<Client | Pool, "query" | "connect" | "end">;

export interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  progress: number;
  learned: boolean;
}

export interface WordOverview {
  id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  progress: number;
  learned_at: string | null;
  mastered_at: string | null;
}

// User Data Types
export enum ModeDay {
  DEFAULT = 1,
  LIGHT = 2,
  DARK = 3,
}

export enum FontSize {
  SMALL = 1,
  NORMAL = 2,
  LARGE = 3,
}

export enum Notifications {
  Disabled = 0,
  Enabled = 1,
}

export interface UserID {
  id: number;
}

export interface User extends UserID {
  username: string;
  mode_day: ModeDay;
  font_size: FontSize;
  notifications: Notifications;
}

export interface UserLogin extends User {
  email: string;
  password: string;
}

// Error Data Types
export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}
