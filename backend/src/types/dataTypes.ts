export interface WordData {
  word_id: number;
  src: string | null;
  trg: string | null;
  prn: string | null;
  progress: number | null;
  next_at: Date | null;
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