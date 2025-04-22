import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import {
  UserScore,
  UserInfo,
  UserSettings,
} from '../../../shared/types/dataTypes';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchWithAuth } from '../utils/firebase.utils';
import { auth } from '../config/firebase.config';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await fetchWithAuth(
          'http://localhost:3000/user/getUser',
          {
            method: 'GET',
          }
        );

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
        fetchUserPreferences();
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
