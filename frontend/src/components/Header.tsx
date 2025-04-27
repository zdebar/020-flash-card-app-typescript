import { ReactNode } from 'react';
import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import RoundButtonLink from './common/RoundButtonLink';
import { useUser } from '../hooks/useUser';

export default function Header(): ReactNode {
  const { userInfo } = useUser();

  return (
    <header className="flex w-full justify-between p-4">
      <RoundButtonLink to="/">
        <HomeIcon />
      </RoundButtonLink>
      <div className="flex gap-4">
        <RoundButtonLink to="/userDashboard" isActive={!!userInfo}>
          <AcademicCapIcon />
        </RoundButtonLink>
        <RoundButtonLink to="/userSettings" isActive={!!userInfo}>
          <UserIcon />
        </RoundButtonLink>
      </div>
    </header>
  );
}
