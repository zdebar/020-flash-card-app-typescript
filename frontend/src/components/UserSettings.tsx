import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signOut } from 'firebase/auth';
import ThemeDropdown from './common/ThemeDropdown';
import ButtonReset from './common/ButtonReset';
import ButtonWithModal from './common/ButtonWithModal';
import SettingProperty from './common/SettingProperty';

export default function UserSettings() {
  const { setUserInfo, setUserScore, setLoading, userInfo, languageID } =
    useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      setUserInfo(null);
      setUserScore(null);
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="card list">
      <SettingProperty
        label="Uživatel:"
        value={userInfo?.name}
        className="px-2"
      />
      <ThemeDropdown className="px-2" />
      <ButtonReset
        apiPath={`/api/users/language/${languageID}`}
        modalMessage="Opravdu chcete resetovat? Veškerý pokrok bude ztracen."
      >
        Reset progres
      </ButtonReset>
      <ButtonWithModal
        modalMessage="Opravdu se chcete odhlásit?"
        onClick={handleLogout}
        successMessage="odhlášení se zdařilo."
        failMessage="odhlášení se nezdařilo."
      >
        Logout
      </ButtonWithModal>
    </div>
  );
}
