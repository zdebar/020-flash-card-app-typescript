import { UserIcon, HomeIcon, AcademicCapIcon, NoteIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import { useEffect, useState } from 'react';
import ButtonLinkRound from './common/ButtonLinkRound';
import Button from './common/Button';

export default function Header({ openNotes }: { openNotes: () => void }) {
  const { userInfo } = useUser();
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      setIsShortScreen(window.innerHeight < 420);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return (
    <header
      className={`z-2 flex w-full justify-between p-4 ${
        isShortScreen ? 'fixed top-0 left-0 h-0' : 'relative'
      }`}
    >
      <div className={`flex ${isShortScreen ? 'h-30 flex-col' : ''} gap-4`}>
        <ButtonLinkRound to="/">
          <HomeIcon />
        </ButtonLinkRound>
        <Button
          buttonColor="button-secondary"
          className="shape-round"
          onClick={openNotes}
        >
          <NoteIcon />
        </Button>
      </div>
      <div className={`flex ${isShortScreen ? 'h-30 flex-col' : ''} gap-4`}>
        <ButtonLinkRound to="/userDashboard" disabled={!userInfo}>
          <AcademicCapIcon />
        </ButtonLinkRound>
        <ButtonLinkRound to="/userSettings" disabled={!userInfo}>
          <UserIcon />
        </ButtonLinkRound>
      </div>
    </header>
  );
}
