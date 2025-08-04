import { HomeIcon, AcademicCapIcon } from './Icons.js';
import { useUser } from '../../hooks/useUser.js';
import ButtonLink from './ButtonLink.js';
import { useLocation } from 'react-router-dom';
import config from '../../config/config.js';
import UserAvatar from './UserAvatar.js';

export default function Header() {
  const { userInfo, languageID } = useUser();
  const location = useLocation();

  function getSelectedClass(pathname: string, targetPath: string): string {
    return pathname === targetPath ? 'color-selected' : '';
  }

  return (
    <header className="header z-20 flex w-full flex-none justify-between">
      <nav
        className="sideheader m-4 flex gap-4"
        role="navigation"
        aria-label="Hlavní navigace"
      >
        <ButtonLink
          className={`${getSelectedClass(location.pathname, '/')} `}
          to="/"
          aria-label="Domů"
          buttonType="button-header"
        >
          <HomeIcon />
        </ButtonLink>
        <ButtonLink
          className={`${getSelectedClass(location.pathname, '/userLanguages')} pb-1 text-xl font-bold`}
          to="/userLanguages"
          aria-label="Uživatelské jazyky"
          disabled={!userInfo}
          buttonType="button-header"
          hidden={true}
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
          className={`${getSelectedClass(location.pathname, '/userDashboard')}`}
          buttonType="button-header"
          to="/userDashboard"
          disabled={!userInfo}
          aria-label="Uživatelský dashboard"
        >
          <AcademicCapIcon />
        </ButtonLink>
        <ButtonLink
          className={` ${getSelectedClass(location.pathname, '/userSettings')}`}
          to="/userSettings"
          buttonType="button-header"
          disabled={!userInfo}
          aria-label="Nastavení uživatele"
        >
          <UserAvatar />
        </ButtonLink>
      </nav>
    </header>
  );
}
