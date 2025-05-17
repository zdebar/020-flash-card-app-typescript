import { getAuth } from 'firebase/auth';
import config from '../config/config';

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
