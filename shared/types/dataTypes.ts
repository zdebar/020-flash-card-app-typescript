// Data types
export interface Item {
  id: number;
  czech: string;
  english: string;
  pronunciation: string | null;
  audio: string | null;
  progress: number;
  hasContextInfo: boolean;
  showContextInfo: boolean;
}

export interface Block {
  block_id: number;
  block_order: number;
  block_name: string;
  block_explanation: string;
  category_id: number;
}

export interface ItemInfo extends Block {
  items: Item[];
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
  itemsTotal: number;
  startedCountToday: number;
  startedCount: number;
  blockCount: number[];
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
