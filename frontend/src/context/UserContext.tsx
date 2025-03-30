import { createContext } from 'react';
import { UserPreferences } from '../types/dataTypes';

export interface UserContextType {
  userInfo: UserPreferences | null;
  loading: boolean;
  setUserInfo: (user: UserPreferences | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
