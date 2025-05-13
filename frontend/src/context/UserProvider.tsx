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
import { UserTheme } from '../../../shared/types/dataTypes';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<UserTheme>('system');

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

    const storedTheme = localStorage.getItem('theme') as UserTheme;
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      applyTheme('system');
    }

    return () => unsubscribe();
  }, []);

  const applyTheme = (theme: UserTheme) => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.remove(prefersDark ? 'light' : 'dark');
    } else {
      document.documentElement.classList.add(
        theme === 'dark' ? 'dark' : 'light'
      );
      document.documentElement.classList.remove(
        theme === 'dark' ? 'light' : 'dark'
      );
    }
  };

  const chooseTheme = (newTheme: UserTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <UserContext.Provider
      value={{
        theme,
        userInfo,
        userSettings,
        userScore,
        loading,
        setUserInfo,
        setUserSettings,
        setUserScore,
        setLoading,
        chooseTheme,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
