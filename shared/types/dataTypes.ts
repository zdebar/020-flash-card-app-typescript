export interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  progress: number;
  learned_at: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  mode_day: number; // 1,2,3 - default 1 / light 2 / dark 3
  font_size: number; // 1,2,3; default normal 2
  notifications: number; // 0,1
}

export interface UserLogin extends User {
  password: string;
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}
