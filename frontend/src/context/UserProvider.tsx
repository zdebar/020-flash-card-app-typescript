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
        const response = await fetchWithAuth('http://localhost:3000/api/users');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { userSettings, userScore } = await response.json();

        if (auth.currentUser) {
          const { uid, email, displayName, photoURL } = auth.currentUser;
          setUserInfo({
            uid,
            email,
            name: displayName || 'Bez jména',
            picture: photoURL || 'Bez emailu',
          });
        }

        setUserScore(userScore);
        setUserSettings(userSettings);
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
