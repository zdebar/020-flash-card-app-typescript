import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import { useUser } from '../hooks/useUser';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { fetchWithAuth } from '../utils/firebase.utils';
import Button from './Button';

export default function LoginCard() {
  const { setUserInfo, setUserSettings, setUserScore, setLoading } = useUser();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const userInfo = result.user;

      const response = await fetchWithAuth(
        'http://localhost:3000/user/getUser'
      );

      const { userSettings, userScore } = await response.json();

      setUserInfo({
        uid: userInfo.uid,
        name: userInfo.displayName,
        email: userInfo.email,
        picture: userInfo.photoURL,
      });
      setUserSettings(userSettings);
      setUserScore(userScore);

      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Přihlášení" onSubmit={handleGoogleLogin}>
      <Button type="submit">Google Login</Button>
    </AuthForm>
  );
}
