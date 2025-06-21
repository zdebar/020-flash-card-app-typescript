import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import ButtonLink from './common/ButtonLink';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const { userInfo } = useUser();
  const location = useLocation();

  return (
    <header className="header z-2 flex w-full justify-between">
      <nav
        className="sideheader m-4 flex gap-4"
        role="navigation"
        aria-label="Hlavní navigace"
      >
        <ButtonLink
          className={`button-round ${location.pathname === '/' ? 'color-disabled' : ''} color-header`}
          to="/"
          aria-label="Domů"
          buttonColor="color-header"
        >
          <HomeIcon />
        </ButtonLink>
      </nav>
      <nav
        className="sideheader m-4 flex gap-4"
        role="navigation"
        aria-label="Uživatelská navigace"
      >
        <ButtonLink
          className={`button-round ${
            location.pathname === '/userDashboard' ? 'color-disabled' : ''
          }`}
          buttonColor="color-header"
          to="/userDashboard"
          disabled={!userInfo}
          aria-label="Uživatelský dashboard"
        >
          <AcademicCapIcon />
        </ButtonLink>
        <ButtonLink
          className={`button-round ${
            location.pathname === '/userSettings' ? 'color-disabled' : ''
          }`}
          to="/userSettings"
          buttonColor="color-header"
          disabled={!userInfo}
          aria-label="Nastavení uživatele"
        >
          <UserIcon />
        </ButtonLink>
      </nav>
    </header>
  );
}
