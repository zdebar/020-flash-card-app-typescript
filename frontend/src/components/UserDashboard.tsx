import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import SubmitButton from './SubmitButton';

export default function UserDashboard() {
  const { setUserInfo, setLoading } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserInfo(null);
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="w-[320px]">
      <SubmitButton onClick={handleLogout}>Logout</SubmitButton>
    </div>
  );
}
