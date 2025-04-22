import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import Button from './Button';

export default function UserSettings() {
  const { userInfo, setUserInfo, setLoading } = useUser();
  const navigate = useNavigate();
  const isActive = userInfo !== null;

  const handleLogout = () => {
    setUserInfo(null);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="w-[320px]">
      <Button onClick={handleLogout} isActive={isActive}>
        Logout
      </Button>
    </div>
  );
}
