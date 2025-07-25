// Data types
export interface Item {
  id: number;
  czech: string;
  translation: string;
  pronunciation: string | null;
  audio: string | null;
  progress: number;
  hasContextInfo: boolean;
  showContextInfo: boolean;
}

export interface BlockExplanation {
  blockId: number;
  blockSequence: number;
  blockName: string;
  blockExplanation: string;
}

// User Types
export interface UserSettings {
  id: number;
}

export type UserTheme = "light" | "dark" | "system";

export interface UserInfo {
  uid: string; // Firebase UID
  name: string | null;
  email: string | null;
  picture: string | null;
}

export interface UserScore {
  languageID: number;
  languageName: string;
  blockCount: number[];
  itemsCountByLevel: Record<string, number>; // all items by cefr level
  learnedCountTodayByLevel: Record<string, number>; // items with progress > 5 by cefr level
  learnedCountByLevel: Record<string, number>; // items with progress > 5 by cefr level
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export enum PracticeError {
  NoAudio = "beze zvuku",
}
