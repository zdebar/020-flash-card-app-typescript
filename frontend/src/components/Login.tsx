import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Button from './common/Button';
import { fetchUser } from '../utils/auth.utils';

export default function Login() {
  const { setUserInfo, setUserSettings, setUserScore, setLoading } = useUser();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      await signInWithPopup(auth, provider);

      fetchUser(setUserInfo, setUserSettings, setUserScore, setLoading);
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
    navigate('/');
  };

  return (
    <>
      <Button onClick={handleGoogleLogin}>Google Login</Button>
    </>
  );
}
