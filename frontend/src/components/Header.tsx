import { ReactNode } from 'react';
import { UserIcon, HomeIcon, AcademicCapIcon } from './Icons';
import RoundButton from './RoundButton';
import { useUser } from '../hooks/useUser';

export default function Header(): ReactNode {
  const { userInfo } = useUser();

  return (
    <header className="flex w-full justify-between gap-4 p-6">
      <RoundButton to="/">
        <HomeIcon />
      </RoundButton>
      <div className="flex gap-4">
        <RoundButton to="/userDashboard" disabled={!userInfo}>
          <AcademicCapIcon />
        </RoundButton>
        <RoundButton to="/userSettings" disabled={!userInfo}>
          <UserIcon />
        </RoundButton>
      </div>
    </header>
  );
}
