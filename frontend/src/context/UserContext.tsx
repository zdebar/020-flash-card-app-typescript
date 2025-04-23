import { createContext } from 'react';
import {
  UserScore,
  UserSettings,
  UserInfo,
} from '../../../shared/types/dataTypes';

export interface UserContextType {
  userInfo: UserInfo | null;
  userSettings: UserSettings | null;
  userScore: UserScore | null;
  loading: boolean;
  setUserInfo: (user: UserInfo | null) => void;
  setUserSettings: (settings: UserSettings | null) => void;
  setUserScore: (score: UserScore | null) => void;
  setLoading: (loading: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
