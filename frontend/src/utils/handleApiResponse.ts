import { NavigateFunction } from 'react-router-dom';
import { UserContextType } from '../context/UserContext';

export const handleApiResponse = async (
  response: Response,
  setUserInfo: UserContextType['setUserInfo'],
  setLoading: UserContextType['setLoading'],
  navigate: NavigateFunction
) => {
  if (response.ok) {
    const data = await response.json();
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      setUserInfo(data.user);
      setLoading(false);
      navigate('/');
    } else {
      throw new Error('Token or user data not found in response.');
    }
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Response not ok.');
  }
};
