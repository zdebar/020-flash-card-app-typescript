import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { AcademicCapIcon, UserIcon } from './Icons';

export default function Header(): ReactNode {
  return (
    <header className="flex w-full justify-end gap-4 p-6">
      <Link to="/Practice">
        <button className="btn-round">
          <AcademicCapIcon className="h-6 w-6" />
        </button>
      </Link>
      <Link to="/User">
        <button className="btn-round">
          <UserIcon className="h-6 w-6" />
        </button>
      </Link>
    </header>
  );
}
