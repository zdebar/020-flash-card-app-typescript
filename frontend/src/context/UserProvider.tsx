import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import { Score, UserInfo, UserSettings } from '../types/dataTypes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [userScore, setUserScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const fetchUserPreferences = async (token: string) => {
      try {
        const response = await fetch('http://localhost:3000/user/getUser', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.userProfile);
          setUserScore(data.score);
          setUserSettings(data.settings);
        } else {
          console.error('Failed to fetch user preferences');
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchUserPreferences(token);
      } else {
        setUserInfo(null);
        setUserScore(null);
        setUserSettings(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        userSettings,
        userScore,
        loading,
        setUserInfo,
        setUserSettings,
        setUserScore,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
