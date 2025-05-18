import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Button from './common/Button';
import Loading from './common/Loading';

export default function Login() {
  const { setLoading } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLocalLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      setLocalLoading(true);
      setError(null);
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError('Přihlášení přes Google selhalo.');
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleGoogleLogin}
        className="button-rectangular w-card"
        aria-label="Přihlásit se přes Google"
        disabled={loading}
      >
        {loading ? <Loading /> : 'Google Login'}
      </Button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </>
  );
}
