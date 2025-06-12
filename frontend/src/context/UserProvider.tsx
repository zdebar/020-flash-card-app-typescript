import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext';
import {
  UserScore,
  UserInfo,
  UserSettings,
} from '../../../shared/types/dataTypes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { UserTheme } from '../../../shared/types/dataTypes';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<UserTheme>('system');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          const data = await fetchWithAuthAndParse<{
            userSettings: UserSettings | null;
            userScore: UserScore | null;
          }>(`/api/users`);

          const userScore = data?.userScore || null;
          const userSettings = data?.userSettings || null;

          if (auth.currentUser) {
            const { uid, email, displayName, photoURL } = auth.currentUser;
            setUserInfo({
              uid,
              email,
              name: displayName || 'Vzorový uživatel',
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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (theme === 'system') {
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      document.documentElement.classList.toggle('light', !prefersDark);
    }
  };

  const chooseTheme = (newTheme: UserTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (event: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', event.matches);
        document.documentElement.classList.toggle('light', !event.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

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
