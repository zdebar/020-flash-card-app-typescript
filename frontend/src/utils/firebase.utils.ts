import { getAuth } from 'firebase/auth';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not logged in');
  }

  const token = await user.getIdToken();

  return fetch(url, {
    method: 'GET',
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};
