import { ReactNode } from 'react';
import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import ButtonLinkRound from './common/ButtonLinkRound';

export default function Header(): ReactNode {
  const { userInfo } = useUser();

  return (
    <header className="flex w-full justify-between p-4">
      <ButtonLinkRound to="/">
        <HomeIcon />
      </ButtonLinkRound>
      <div className="flex gap-4">
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
