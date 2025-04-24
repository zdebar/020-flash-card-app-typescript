// Word Note Data Types
export interface Note {
  // Notes from users to developers
  word_id: number;
  note: string;
}

// Word Data Types
export interface WordProgress {
  // Minimized word data send back from frontend
  id: number;
  progress: number;
}

export interface WordTransfer extends WordProgress {
  // Word extractred from database send to frontend
  czech: string;
  english: string;
  pronunciation: string | null;
  audio: string | null;
  started: boolean;
  learned: boolean;
}

export interface WordUpdate extends WordProgress {
  // Prepared word data for update in database
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

export enum PlanType {
  FREE = "free",
  PREMIUM = "premium",
}

// User Types

export interface UserInfo {
  uid: string; // Firebase UID
  name: string | null; // User's name
  email: string | null; // User's email
  picture: string | null; // User's profile picture URL
}

export interface UserSettings {
  mode_day: ModeDay;
  font_size: FontSize;
  plan_type: PlanType;
}

export interface UserScore {
  learnedCountToday: number;
  learnedCount: number;
  startedCountToday: number;
  startedCount: number;
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}
