import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Button from './common/Button';
import ThemeDropdown from './common/ThemeDropdown';
import ConfirmModal from './common/ConfirmModal';

export default function UserSettings() {
  const { setUserInfo, setUserSettings, setUserScore, setLoading } = useUser();
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);

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
    <div className="max-w-card flex flex-col gap-1">
      <Button
        onClick={() => setModalVisible(true)}
        className="button-rectangular"
      >
        Logout
      </Button>
      <ThemeDropdown />
      <ConfirmModal
        isVisible={isModalVisible}
        text="Opravdu se chcete odhlásit?"
        onConfirm={() => {
          setModalVisible(false);
          handleLogout();
        }}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
}
