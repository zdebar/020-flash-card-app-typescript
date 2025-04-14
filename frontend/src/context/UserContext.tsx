import { createContext } from 'react';
import { User, Score } from '../types/dataTypes';

export interface UserContextType {
  userInfo: User | null;
  loading: boolean;
  userScore: Score | null;
  setUserInfo: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setUserScore: (score: Score | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
