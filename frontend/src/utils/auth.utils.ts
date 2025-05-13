import { getAuth } from 'firebase/auth';
import config from '../config/config';
import { UserScore, UserSettings } from '../../../shared/types/dataTypes';
import { auth } from '../config/firebase.config';

export const fetchWithAuthAndParse = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const auth = getAuth();
  const user = auth.currentUser;
  const urlPath = config.Url + url;

  if (!user) {
    throw new Error('User is not logged in');
  }

  const token = await user.getIdToken();

  try {
    const response = await fetch(urlPath, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }

      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred.');
      } catch {
        throw new Error('Failed to parse error response.');
      }
    }

    try {
      return await response.json();
    } catch {
      console.warn('Response succeeded, but data could not be parsed.');
      return null;
    }
  } catch (error) {
    console.error('Error during fetch:', error);
    return null;
  }
};

interface SetUserInfo {
  (userInfo: {
    uid: string;
    email: string | null;
    name: string;
    picture: string;
  }): void;
}

interface SetUserSettings {
  (userSettings: UserSettings | null): void;
}

interface SetUserScore {
  (userScore: UserScore | null): void;
}

interface SetLoading {
  (isLoading: boolean): void;
}

export const fetchUser = async (
  setUserInfo: SetUserInfo,
  setUserSettings: SetUserSettings,
  setUserScore: SetUserScore,
  setLoading: SetLoading
): Promise<void> => {
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
        name: displayName || 'Bez jména',
        picture: photoURL || 'Bez emailu',
      });
    }

    console.log('User score:', userScore);
    setUserScore(userScore);
    setUserSettings(userSettings);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
  } finally {
    setLoading(false);
  }
};
