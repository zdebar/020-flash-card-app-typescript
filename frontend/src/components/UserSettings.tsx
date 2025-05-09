import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signOut } from 'firebase/auth';
import Button from './common/Button';

export default function UserSettings() {
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
    <div className="w-full">
      {userInfo && <h1>uživatel: {userInfo.name}</h1>}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
