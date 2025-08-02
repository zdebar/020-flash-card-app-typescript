import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getAuth, signOut } from 'firebase/auth';
import ThemeDropdown from './common/ThemeDropdown';

import ButtonWithModal from './common/ButtonWithModal';
import SettingProperty from './common/SettingProperty';

export default function UserSettings() {
  const { setUserInfo, setUserScore, setUserLoading, userInfo } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      setUserInfo(null);
      setUserScore(null);
      setUserLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="card list px-2 pt-4">
      <SettingProperty label="Uživatel:" value={userInfo?.name} />
      <ThemeDropdown />
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
