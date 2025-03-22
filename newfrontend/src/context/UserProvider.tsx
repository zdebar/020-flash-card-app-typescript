import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import { fetchUserInfo } from '../functions/fetchUserInfo';
import { UserLogin } from '../types/dataTypes';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserLogin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const user = await fetchUserInfo();
          setUserInfo(user);
        } catch (error) {
          console.error('Token invalid or expired', error);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }

      setLoading(false);
    };

    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, loading, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
