export interface WordNew {
  id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null  
}

export interface Word extends WordNew {
  progress: number | null
}

export interface User {
  id: number;
  username: string;
  email: string;  
  created_at: string;
}

export interface UserLogin extends User {
  password: string;  
}

export interface UserSettings extends User {
  mode_day: number;
  font_size: number;
  notifications: number;
}



