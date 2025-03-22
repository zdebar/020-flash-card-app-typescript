export interface WordData {
  word_id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  progress: number | null;
}

export type WordDataNew = Omit<WordData, 'progress'>

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

export type UserLogin = Omit<User, 'password' | 'created_at'>

export interface JsonData {
  words: WordData[];
}