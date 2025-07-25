import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Button from './common/Button';
import ThemeDropdown from './common/ThemeDropdown';
import ConfirmModal from './common/ConfirmModal';
import ButtonReset from './common/ButtonReset';

export default function UserSettings() {
  const {
    setUserInfo,
    setUserSettings,
    setUserScore,
    setLoading,
    userInfo,
    languageID,
  } = useUser();
  const navigate = useNavigate();
  const [isLogoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      setUserInfo(null);
      setUserScore(null);
      setUserSettings(null);
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="max-w-card flex flex-col gap-2">
      <p className="px-2">
        <span className="inline-block w-22">Uživatel:</span> {userInfo?.name}
      </p>
      <ThemeDropdown className="px-2" />
      <Button
        name="logout"
        onClick={() => setLogoutVisible(true)}
        className="button-rectangular"
      >
        Logout
      </Button>
      <ConfirmModal
        isVisible={isLogoutVisible}
        text="Opravdu se chcete odhlásit?"
        className="mt-14"
        onConfirm={() => {
          setLogoutVisible(false);
          handleLogout();
        }}
        onCancel={() => setLogoutVisible(false)}
      />
      <ButtonReset
        canReset={true}
        apiPath={`/api/users/language/${languageID}`}
        modalMessage="Opravdu chcete resetovat? Veškerý pokrok bude ztracen."
        className="justify-center"
      >
        Reset
      </ButtonReset>
    </div>
  );
}
