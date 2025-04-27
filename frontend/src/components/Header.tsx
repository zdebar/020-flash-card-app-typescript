import { ReactNode } from 'react';
import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import ButtonLink from './common/ButtonLink';

export default function Header(): ReactNode {
  const { userInfo } = useUser();

  return (
    <header className="flex w-full justify-between p-4">
      <ButtonLink to="/">
        <HomeIcon />
      </ButtonLink>

      <div className="flex gap-4">
        <ButtonLink to="/userDashboard" isActive={!!userInfo}>
          <AcademicCapIcon />
        </ButtonLink>
        <ButtonLink to="/userSettings" isActive={!!userInfo}>
          <UserIcon />
        </ButtonLink>
      </div>
    </header>
  );
}
