export interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;  
  progress: number
}

export interface User {
  id: number;
  username: string;
  email: string;  
  created_at: string; // ISO 8601 string
}

export interface UserLogin extends User {
  password: string;  
}

export interface UserSettings extends User {
  mode_day: number;
  font_size: number;
  notifications: number;
}



