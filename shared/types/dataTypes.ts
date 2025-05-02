// Word Data Types
export interface WordProgress {
  // Minimized word data send back from frontend
  id: number;
  progress: number;
  skipped: boolean;
}

export interface Word extends WordProgress {
  // Word extractred from database send to frontend
  czech: string;
  english: string;
  pronunciation: string | null;
  audio: string | null;
  started: boolean;
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

// Grammar Data Types
export interface GrammarWord {
  // Individual word data extracted as a part of grammar lecture
  id: number;
  czech: string;
  english: string;
  pronunciation: string | null;
  audio: string | null;
}

export interface GrammarProgress {
  // Minimized word data for database update  send back from frontend
  block_id: number;
  progress: number;
  skipped: boolean;
}

export interface GrammarLecture extends GrammarProgress {
  // Prepared grammar lecture data send to frontend
  block_name: string;
  block_explanation: string;
  items: GrammarWord[];
}

// Pronunciation Data Types
export interface PronunciationWord {
  // Individual word data extracted as a part of pronunciation lecture
  id: number;
  czech: string;
  english: string;
  pronunciation: string | null;
  audio: string | null;
  group: number;
}

export interface PronunciationLecture {
  // Prepared pronunciation lecture data send to frontend
  block_id: number;
  block_name: string;
  block_explanation: string;
  items: PronunciationWord[][]; // Grouped by group into subarrays
}

export interface PronunciationItem {
  // List of pronunciation blocks extracted from database
  id: number;
  block_name: string;
}

// User Types

export interface UserSettings {
  id: number; // User ID in the database
}

export interface UserInfo {
  uid: string; // Firebase UID
  name: string | null; // User's name
  email: string | null; // User's email
  picture: string | null; // User's profile picture URL
}

export interface UserScore {
  startedCountToday: number;
  startedCount: number;
  nextGrammarDate: Date | null;
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}
