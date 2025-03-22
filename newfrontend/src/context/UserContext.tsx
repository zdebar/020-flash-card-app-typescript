import { createContext } from 'react';
import { UserLogin } from '../types/dataTypes';

export interface UserContextType {
  userInfo: UserLogin | null;
  loading: boolean;
  setUserInfo: (user: UserLogin | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
