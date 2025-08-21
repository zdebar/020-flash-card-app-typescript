import { createContext } from 'react';
import {
  UserScore,
  UserInfo,
  UserTheme,
} from '../../../shared/types/dataTypes';

export interface UserContextType {
  userInfo: UserInfo | null;
  userScore: UserScore[] | null;
  userLoading: boolean;
  languageId: number;
  theme: UserTheme;
  setUserInfo: (user: UserInfo | null) => void;
  setUserScore: (score: UserScore[] | null) => void;
  setUserLoading: (loading: boolean) => void;
  setLanguageID: (languageId: number) => void;
  chooseTheme: (theme: UserTheme) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
