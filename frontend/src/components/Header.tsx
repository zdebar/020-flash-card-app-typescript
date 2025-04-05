import { ReactNode } from 'react';
import { AcademicCapIcon, UserIcon, HomeIcon } from './Icons';
import RoundButton from './RoundButton';

export default function Header(): ReactNode {
  return (
    <header className="flex w-full justify-end gap-4 p-6">
      <RoundButton to="/">
        <HomeIcon />
      </RoundButton>
      <RoundButton to="/card">
        <AcademicCapIcon />
      </RoundButton>
      <RoundButton to="/userDashboard">
        <UserIcon />
      </RoundButton>
    </header>
  );
}
