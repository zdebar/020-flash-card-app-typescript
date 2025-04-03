import { createContext } from 'react';
import { User } from '../../../shared/types/dataTypes';

export interface UserContextType {
  userInfo: User | null;
  loading: boolean;
  setUserInfo: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
