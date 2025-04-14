import { ReactNode } from 'react';
import { UserIcon, HomeIcon } from './Icons';
import Button from './Button';
import { useUser } from '../hooks/useUser';

export default function Header(): ReactNode {
  const { userInfo } = useUser();

  return (
    <header className="flex w-full justify-between gap-4 p-6">
      <Button to="/" className="rounded-full">
        <HomeIcon />
      </Button>
      <Button to="/userDashboard" disabled={!userInfo} className="rounded-full">
        <UserIcon />
      </Button>
    </header>
  );
}
