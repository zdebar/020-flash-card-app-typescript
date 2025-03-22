import { Link } from 'react-router-dom';
import { AcademicCapIcon, UserIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';

export default function Header(): ReactNode {
  return (
    <header className="bg-base-100 p-6 w-full flex justify-end gap-4">
      <Link to="/Practice">
        <button className="btn btn-primary btn-circle btn-lg">
          <AcademicCapIcon className="w-6 h-6" />
        </button>
      </Link>
      <Link to="/User">
        <button className="btn btn-primary btn-circle btn-lg">
          <UserIcon className="w-6 h-6" />
        </button>
      </Link>
    </header>
  );
}



      
      