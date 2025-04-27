import { ReactNode } from 'react';
import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import ButtonLink from './common/ButtonLink';

export default function Header(): ReactNode {
  const { userInfo } = useUser();

  return (
    <header className="flex w-full justify-between p-4 landscape:fixed landscape:top-0 landscape:right-0 landscape:left-0 landscape:z-10 landscape:h-0">
      <ButtonLink to="/">
        <HomeIcon />
      </ButtonLink>
      <div className="lanscape:z-12 flex gap-4 landscape:flex-col">
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
