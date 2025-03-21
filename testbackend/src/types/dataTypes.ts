export interface WordData {
  word_id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  progress: number | null;
}

export interface WordDataNew extends Omit<WordData, 'progress'> {
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface UserLogin extends Omit<User, 'password' | 'created_at'> {
}