import { ReactNode } from 'react';
import { AcademicCapIcon, UserIcon, HomeIcon } from './Icons';
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
        <RoundButton to="/practice" disabled={!userInfo}>
          <AcademicCapIcon className="size-5.5" />
        </RoundButton>
        <RoundButton to="/userDashboard" disabled={!userInfo}>
          <UserIcon />
        </RoundButton>
      </div>
    </header>
  );
}
