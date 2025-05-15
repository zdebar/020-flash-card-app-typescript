import { UserIcon, HomeIcon, AcademicCapIcon } from './common/Icons';
import { useUser } from '../hooks/useUser';
import ButtonLink from './common/ButtonLink';

export default function Header() {
  const { userInfo } = useUser();

  return (
    <header className={`header z-2 flex w-full justify-between`}>
      <div className={`sideheader m-4 flex gap-4`}>
        <ButtonLink className="button-round" to="/">
          <HomeIcon />
        </ButtonLink>
      </div>
      <div className={`sideheader m-4 flex gap-4`}>
        <ButtonLink
          className="button-round"
          to="/userDashboard"
          disabled={!userInfo}
        >
          <AcademicCapIcon />
        </ButtonLink>
        <ButtonLink
          className="button-round"
          to="/userSettings"
          disabled={!userInfo}
        >
          <UserIcon />
        </ButtonLink>
      </div>
    </header>
  );
}
