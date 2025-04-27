import { ReactNode } from 'react';
import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import RoundButton from './common/RoundButton';
import { useUser } from '../hooks/useUser';

export default function Header(): ReactNode {
  const { userInfo } = useUser();

  return (
    <header className="flex w-full justify-between p-4">
      <RoundButton to="/">
        <HomeIcon />
      </RoundButton>
      <div className="flex gap-4">
        <RoundButton to="/userDashboard" isActive={!!userInfo}>
          <AcademicCapIcon />
        </RoundButton>
        <RoundButton to="/userSettings" isActive={!!userInfo}>
          <UserIcon />
        </RoundButton>
      </div>
    </header>
  );
}
