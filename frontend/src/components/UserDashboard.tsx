import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import SubmitButton from './SubmitButton';

export default function UserDashboard() {
  const { userInfo, setUserInfo, setLoading } = useUser();
  const navigate = useNavigate();
  const isActive = userInfo !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserInfo(null);
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="w-[320px]">
      <SubmitButton onClick={handleLogout} isActive={isActive}>
        Logout
      </SubmitButton>
    </div>
  );
}
