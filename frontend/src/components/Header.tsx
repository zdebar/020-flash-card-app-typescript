import { Link } from 'react-router-dom';
import Icon, { IconBell, IconLibrary, IconUser}  from './Icons/Icon.tsx';
import { ReactNode } from 'react';

export default function Header(): ReactNode {
  return (
    <header className="flex justify-right gap-2 p-2 mt-3 border">
      <Link to="/">
        <Icon IconImage={IconBell} style={{ width: "20px", fill: "var(--text-color)" }} />
      </Link>
      <Link to="/Library">
        <Icon IconImage={IconLibrary} style={{ width: "16px", fill: "var(--text-color)" }} />
      </Link>
      <Link to="/User">
        <Icon IconImage={IconUser} style={{ width: "19px", fill: "var(--text-color)" }} />
      </Link>
    </header>
  );
}
