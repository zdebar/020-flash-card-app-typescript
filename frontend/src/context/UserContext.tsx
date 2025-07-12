import { createContext } from 'react';
import {
  UserScore,
  UserSettings,
  UserInfo,
  UserTheme,
} from '../../../shared/types/dataTypes';

export interface UserContextType {
  userInfo: UserInfo | null;
  userSettings: UserSettings | null;
  userScore: UserScore[] | null;
  loading: boolean;
  languageID: number;
  theme: UserTheme;
  setUserInfo: (user: UserInfo | null) => void;
  setUserSettings: (settings: UserSettings | null) => void;
  setUserScore: (score: UserScore[] | null) => void;
  setLoading: (loading: boolean) => void;
  setLanguageID: (languageID: number) => void;
  chooseTheme: (theme: UserTheme) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
