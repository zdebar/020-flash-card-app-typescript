import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signOut } from 'firebase/auth';
import Button from './common/Button';
import ThemeDropdown from './common/ThemeDropdown';

export default function UserSettings() {
  const { setUserInfo, setUserSettings, setUserScore, setLoading } = useUser();
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
    <div className="flex w-[320px] flex-col gap-4">
      <Button onClick={handleLogout} className="button-rectangular">
        Logout
      </Button>
      <ThemeDropdown />
    </div>
  );
}
