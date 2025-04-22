import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import Button from './Button';
import { getAuth, signOut } from 'firebase/auth';

export default function UserSettings() {
  const { userInfo, setUserInfo, setUserSettings, setUserScore, setLoading } =
    useUser();
  const navigate = useNavigate();
  const isActive = userInfo !== null;

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
    <div className="w-[320px]">
      {userInfo && <p>Uživatel: {userInfo.name}</p>}
      <Button onClick={handleLogout} isActive={isActive}>
        Logout
      </Button>
    </div>
  );
}
