import { UserContextType } from '../context/UserContext';
import { NavigateFunction } from 'react-router-dom';

// TODO: Maybe add post, get as parameter to this function
export const postAuth = async (
  payload: Record<string, string>,
  setUserInfo: UserContextType['setUserInfo'],
  setLoading: UserContextType['setLoading'],
  navigate: NavigateFunction,
  setUserError: (message: string) => void,
  API_PATH: string
) => {
  console.log('API Path:', API_PATH);

  try {
    const response = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    console.log('API response:', response);

    if (response.ok) {
      try {
        const data = await response.json();
        if (data) {
          console.log('Registration / Login successful:', data);
          setUserInfo(data);
          navigate('/');
        } else {
          console.warn('No user data returned from the server.');
        }
      } catch (error: unknown) {
        console.error(
          'Error during processing response login / registration:',
          error
        );
      }
    } else {
      try {
        const errorData = await response.json();
        console.error(
          `Registration / Login failed with status ${response.status}: ${errorData.message}`
        );
      } catch (error: unknown) {
        console.error('Error parsing error response:', error);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      setUserError(error.message);
    } else {
      setUserError('Došlo k neznámé chybě.');
    }
  } finally {
    setLoading(false);
  }
};
