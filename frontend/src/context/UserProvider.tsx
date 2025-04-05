import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import { getAPI } from '../functions/getAPI';
import { User } from '../types/dataTypes';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_PATH = `http://localhost:3000/user/getPreferences`;

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
      value={{ userInfo, loading, setUserInfo, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}
