import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import {
  UserScore,
  UserInfo,
  UserSettings,
} from '../../../shared/types/dataTypes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { fetchUser } from '../utils/auth.utils';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      fetchUser(setUserInfo, setUserSettings, setUserScore, setLoading);
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
