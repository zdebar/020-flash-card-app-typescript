import Dashboard from './common/Dashboard';
import ButtonLink from './common/ButtonLink';
import { useUser } from '../hooks/useUser';

export default function UserDashboardCard() {
  const { userScore } = useUser();

  return (
    <div className="color-secondary w-[320px]">
      <ButtonLink to="/practice" shape="rectangular">
        Slovíčka
      </ButtonLink>
      <Dashboard
        today={userScore?.startedCountToday}
        total={userScore?.startedCount}
      />
    </div>
  );
}
