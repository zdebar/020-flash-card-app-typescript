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
      navigate('/userDashboard');
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
      navigate('/userDashboard');
    } catch (error) {
      setError('Demo login failed.');
      console.error('Demo login failed:', error);
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return (
    <div className="card">
      <Button
        onClick={handleDemoLogin}
        aria-label="Přihlásit se jako demo uživatel"
        disabled={loading}
      >
        Demo Account
      </Button>
      <p className="notice py-2">Google login otevřen pouze pro testery.</p>
      <Button
        onClick={handleGoogleLogin}
        aria-label="Přihlásit se přes Google"
        disabled={loading}
      >
        Google Login
      </Button>

      {error && <p className="error mt-2">{error}</p>}
    </div>
  );
}
