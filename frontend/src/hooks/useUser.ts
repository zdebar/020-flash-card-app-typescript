import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { UserContextType } from '../context/UserContext';

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
