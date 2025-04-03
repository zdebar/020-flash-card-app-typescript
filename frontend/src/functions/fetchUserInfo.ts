import { UserPreferences } from '../../../shared/types/dataTypes';

export async function fetchUserInfo(): Promise<UserPreferences | null> {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch('http://localhost:3000/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error authenticating user:', error);
    }
    return null;
  }
}
