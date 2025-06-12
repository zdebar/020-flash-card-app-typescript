import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import ButtonLink from './common/ButtonLink';

export default function Header() {
  const { userInfo } = useUser();

  return (
    <header className="header z-2 flex w-full justify-between">
      <nav
        className="sideheader m-4 flex gap-4"
        role="navigation"
        aria-label="Hlavní navigace"
      >
        <ButtonLink className="button-round" to="/" aria-label="Domů">
          <HomeIcon />
        </ButtonLink>
      </nav>
      <nav
        className="sideheader m-4 flex gap-4"
        role="navigation"
        aria-label="Uživatelská navigace"
      >
        <ButtonLink
          className="button-round"
          buttonColor="color-secondary"
          to="/userDashboard"
          disabled={!userInfo}
          aria-label="Uživatelský dashboard"
        >
          <AcademicCapIcon />
        </ButtonLink>
        <ButtonLink
          className="button-round"
          to="/userSettings"
          disabled={!userInfo}
          aria-label="Nastavení uživatele"
        >
          <UserIcon />
        </ButtonLink>
      </nav>
    </header>
  );
}
