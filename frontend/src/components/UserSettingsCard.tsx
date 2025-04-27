import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import RectangularButtonOnClick from './common/RectangularButtonOnClick';
import { getAuth, signOut } from 'firebase/auth';

export default function UserSettingsCard() {
  const { userInfo, setUserInfo, setUserSettings, setUserScore, setLoading } =
    useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUserInfo(null);
      setUserScore(null);
      setUserSettings(null);
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="w-full p-4">
      {userInfo && <h1>uživatel: {userInfo.name}</h1>}
      <RectangularButtonOnClick onClick={handleLogout} className="rounded-md">
        Logout
      </RectangularButtonOnClick>
    </div>
  );
}
