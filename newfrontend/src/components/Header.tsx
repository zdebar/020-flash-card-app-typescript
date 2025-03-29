import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { AcademicCapIcon, UserIcon } from './Icons';

export default function Header(): ReactNode {
  return (
    <header className="p-6 w-full flex justify-end gap-4">
      <Link to="/Practice">
        <button className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md active:shadow-none hover:bg-blue-800">
          <AcademicCapIcon className="w-6 h-6" />
        </button>
      </Link>
      <Link to="/User">
        <button className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md active:shadow-none hover:bg-blue-800">
          <UserIcon className="w-6 h-6" />
        </button>
      </Link>
    </header>
  );
}




      
      