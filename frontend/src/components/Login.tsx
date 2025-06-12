import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
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

  const handleDemoLogin = async () => {
    const auth = getAuth();
    const demoEmail = 'demo@example.com';
    const demoPassword = 'password123';

    try {
      setLoading(true);
      setLocalLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      navigate('/');
    } catch (error) {
      setError('Demo login failed.');
      console.error('Demo login failed:', error);
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleDemoLogin}
        className="button-rectangular max-w-card"
        aria-label="Přihlásit se jako demo uživatel"
        disabled={loading}
      >
        {loading ? <Loading /> : 'Demo Account'}
      </Button>
      <p className="color-error pt-4 text-sm">
        Google login otevřen pouze pro testery.
      </p>
      <Button
        onClick={handleGoogleLogin}
        className="button-rectangular max-w-card"
        aria-label="Přihlásit se přes Google"
        disabled={loading}
      >
        {loading ? <Loading /> : 'Google Login'}
      </Button>

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </>
  );
}
