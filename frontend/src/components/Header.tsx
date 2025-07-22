import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import ButtonLink from './common/ButtonLink';
import { useLocation } from 'react-router-dom';
import config from '../config/config';

export default function Header() {
  const { userInfo, languageID } = useUser();
  const location = useLocation();

  function getSelectedClass(pathname: string, targetPath: string): string {
    return pathname === targetPath ? 'color-selected' : '';
  }

  return (
    <header className="header z-2 flex w-full justify-between">
      <nav
        className="sideheader m-4 flex gap-4"
        role="navigation"
        aria-label="Hlavní navigace"
      >
        <ButtonLink
          className={`button-round ${getSelectedClass(location.pathname, '/')} color-header`}
          to="/"
          aria-label="Domů"
          buttonColor="color-header"
        >
          <HomeIcon />
        </ButtonLink>
        <ButtonLink
          className={`button-round ${getSelectedClass(location.pathname, '/userLanguages')} color-header pb-1 text-2xl font-bold`}
          to="/userLanguages"
          aria-label="Uživatelské jazyky"
          disabled={!userInfo}
          buttonColor="color-header"
        >
          {config.languages.find((lang) => lang.id === languageID)?.code}
        </ButtonLink>
      </nav>
      <nav
        className="sideheader m-4 flex gap-4"
        role="navigation"
        aria-label="Uživatelská navigace"
      >
        <ButtonLink
          className={`button-round ${getSelectedClass(location.pathname, '/userDashboard')}`}
          buttonColor="color-header"
          to="/userDashboard"
          disabled={!userInfo}
          aria-label="Uživatelský dashboard"
        >
          <AcademicCapIcon />
        </ButtonLink>
        <ButtonLink
          className={`button-round ${getSelectedClass(location.pathname, '/userSettings')}`}
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
