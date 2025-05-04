// Item types
export interface Item {
  // Send to frontend
  id: number;
  czech: string;
  english: string;
  pronunciation: string | null;
  audio: string | null;
  progress: number;
  skipped: boolean;
  started: boolean;
}

export interface ItemProgress {
  // Send to backend, to upgrade user_items table
  id: number;
  progress: number;
  skipped: boolean;
}

// User Types
export interface UserSettings {
  id: number; // User ID in the database
}

export interface UserInfo {
  // Frontend user info
  uid: string; // Firebase UID
  name: string | null; // User's name
  email: string | null; // User's email
  picture: string | null; // User's profile picture URL
}

export interface UserScore {
  // Gamification score
  startedCountToday: number;
  startedCount: number;
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}
