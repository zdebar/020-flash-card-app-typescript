import { ReactNode } from 'react';
import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import { useEffect, useState } from 'react';
import ButtonLinkRound from './common/ButtonLinkRound';

export default function Header(): ReactNode {
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
      className={`z-50 flex w-full justify-between p-4 ${
        isShortScreen ? 'fixed top-0 left-0' : 'relative mb-4'
      }`}
    >
      <ButtonLinkRound to="/">
        <HomeIcon />
      </ButtonLinkRound>
      <div className={`flex ${isShortScreen && 'flex-col'} gap-4`}>
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
