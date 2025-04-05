import { NavigateFunction } from 'react-router-dom';
import { UserContextType } from '../context/UserContext';

export const handleLoginResponse = async (
  response: Response,
  setUserInfo: UserContextType['setUserInfo'],
  setLoading: UserContextType['setLoading'],
  navigate: NavigateFunction
) => {
  try {
    if (response.ok) {
      const data = await response.json();
      if (data) {
        console.log('Registration / Login successful:', data);
        setUserInfo(data);
        navigate('/');
      } else {
        console.warn('No user data returned from the server.');
      }
    } else {
      const errorData = await response.json();
      console.error(
        `Registration / Login failed with status ${response.status}: ${errorData.message}`
      );
    }
  } catch (error: unknown) {
    console.error(
      'Error during processing response login / registration:',
      error
    );
  } finally {
    setLoading(false);
  }
};
