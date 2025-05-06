import Dashboard from './common/Dashboard';
import ButtonLinkRectangular from './common/ButtonLinkRectangular';
import { useUser } from '../hooks/useUser';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="color-secondary w-[320px]">
      <ButtonLinkRectangular to="/practice">Slovíčka</ButtonLinkRectangular>
      <Dashboard
        today={userScore?.startedCountToday}
        total={userScore?.startedCount}
      />
    </div>
  );
}
