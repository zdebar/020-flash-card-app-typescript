import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import { getAPI } from '../functions/getAPI';
import { User, Score } from '../types/dataTypes';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userScore, setUserScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_PATH = `http://localhost:3000/user/getUser`;

    const fetchUserPreferences = async () => {
      try {
        await getAPI<User>(API_PATH, setUserInfo);
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        userScore,
        loading,
        setUserInfo,
        setUserScore,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
