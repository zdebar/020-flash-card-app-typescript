import { getAuth } from 'firebase/auth';
import config from '../config/config';

export const fetchWithAuthAndParse = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const auth = getAuth();
  const user = auth.currentUser;
  const urlPath = config.backendURL + url;

  if (!user) {
    throw new Error('User is not logged in');
  }

  const token = await user.getIdToken();

  const { method = 'GET', body, headers, ...restOptions } = options;

  // Remove body for GET/HEAD requests
  const requestOptions: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(method !== 'GET' && method !== 'HEAD' ? { body } : {}), // Include body only for allowed methods
    ...restOptions,
  };

  try {
    const response = await fetch(urlPath, requestOptions);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred.');
    }

    try {
      return await response.json();
    } catch {
      console.log('Response succeeded, but data could not be parsed.');
      return null;
    }
  } catch (error) {
    console.log('Error during fetch:', error);
    return null;
  }
};
