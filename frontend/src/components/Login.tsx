import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Button from './common/Button';

export default function Login() {
  const { setLoading } = useUser();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleGoogleLogin} className="button-rectangular w-card">
        Google Login
      </Button>
    </>
  );
}
