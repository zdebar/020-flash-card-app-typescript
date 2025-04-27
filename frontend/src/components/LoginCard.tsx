import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { fetchWithAuth } from '../utils/firebase.utils';
import config from '../config/config';
import Button from './common/Button';

export default function LoginCard() {
  const { setUserInfo, setUserSettings, setUserScore, setLoading } = useUser();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      await signInWithPopup(auth, provider);

      const response = await fetchWithAuth(`${config.Url}/api/users`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { userSettings, userScore } = await response.json();

      if (auth.currentUser) {
        const { uid, email, displayName, photoURL } = auth.currentUser;
        setUserInfo({
          uid,
          email,
          name: displayName || 'Bez jména',
          picture: photoURL || 'Bez emailu',
        });
      }

      setUserSettings(userSettings);
      setUserScore(userScore);
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
    navigate('/');
  };

  return (
    <div className="w-full p-4">
      <Button onClick={handleGoogleLogin} className="rounded-md">
        Google Login
      </Button>
    </div>
  );
}
