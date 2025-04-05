import { User, Word } from '../../../shared/types/dataTypes';

async function fetchData<T>(
  apiPath: string,
  storageKey?: string
): Promise<T | null> {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(apiPath, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Unauthorized. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred.');
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchAndSaveUserPreferences(): Promise<User | null> {
  const API_PATH = `http://localhost:3000/auth/getPreferences`;
  return fetchData<User>(API_PATH, 'userPreferences');
}

export async function fetchAndSaveUserWords(): Promise<Word[] | null> {
  const API_PATH = `http://localhost:3000/user/getUserWords?srcLanguage=2&trgLanguage=1`;
  return fetchData<Word[]>(API_PATH, 'userWords');
}
