import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import { fetchUserPreferences } from '../functions/fetchUserPreferences';
import { User } from '../../../shared/types/dataTypes';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const user = await fetchUserPreferences();
          setUserInfo(user);
        } catch (error) {
          console.error('Token invalid or expired', error);
          setUserInfo(null);
          localStorage.removeItem('token');
        }
      } else {
        setUserInfo(null);
      }

      setLoading(false);
    };

    getUserInfo();
  }, []);

  return (
    <UserContext.Provider
      value={{ userInfo, loading, setUserInfo, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}
