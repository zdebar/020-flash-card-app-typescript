import { NavigateFunction } from 'react-router-dom';
import { UserContextType } from '../context/UserContext';

export const handleLoginResponse = async (
  response: Response,
  setUserInfo: UserContextType['setUserInfo'],
  setLoading: UserContextType['setLoading'],
  navigate: NavigateFunction
) => {
  if (response.ok) {
    const data = await response.json();
    const { token, userPreferences } = data;
    if (token && userPreferences) {
      localStorage.setItem('token', token);
      setUserInfo(userPreferences);
      setLoading(false);
      navigate('/');
    } else {
      throw new Error('Token or userPreferences not found in response.');
    }
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Response not ok.');
  }
};
