import { createContext } from 'react';
import { Score, UserSettings, UserInfo } from '../types/dataTypes';

export interface UserContextType {
  userInfo: UserInfo | null;
  userSettings: UserSettings | null;
  userScore: Score | null;
  loading: boolean;
  setUserInfo: (user: UserInfo | null) => void;
  setUserSettings: (settings: UserSettings | null) => void;
  setUserScore: (score: Score | null) => void;
  setLoading: (loading: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
