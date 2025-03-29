import { ReactNode } from 'react';
import { AcademicCapIcon, UserIcon } from './Icons';
import { RoundButton } from './RoundButton';

export default function Header(): ReactNode {
  return (
    <header className="flex w-full justify-end gap-4 p-6">
      <RoundButton to="/Practice">
        <AcademicCapIcon />
      </RoundButton>
      <RoundButton to="/Practice">
        <UserIcon />
      </RoundButton>
    </header>
  );
}
