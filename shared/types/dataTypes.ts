// Data types
export interface Practice {
  isBlocke: boolean;
  items: Item[];
}
export interface Item {
  id: number;
  czech: string;
  translation: string;
  pronunciation: string | null;
  audio: string | null;
  progress: number; // Startign from 0
  hasContextInfo: boolean;
  showContextInfo: boolean;
  nextDate?: string | null;
  learnedDate?: string | null;
  masteredDate?: string | null;
}

export interface BlockExplanation {
  blockId: number;
  blockSequence: number;
  blockName: string;
  blockExplanation: string;
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
  blockCount: Record<string, number>; // { "2025-08-12": 12, "2025-08-11": 10, ... }
  itemsCountByLevel: Record<string, number>; // all items by level
  learnedCountTodayByLevel: Record<string, number>; // items with progress > config.learnedProgress by level
  learnedCountByLevel: Record<string, number>; // items with progress > config.learnedProgress by level
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
