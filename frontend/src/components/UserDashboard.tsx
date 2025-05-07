import Dashboard from './common/Dashboard';
import ButtonLinkRectangular from './common/ButtonLinkRectangular';
import { useUser } from '../hooks/useUser';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="flex h-[320px] w-[320px] flex-col justify-between gap-1">
      <ButtonLinkRectangular to="/practice">Procvičovat</ButtonLinkRectangular>
      <Dashboard
        className="color-secondary-disabled"
        today={userScore?.startedCountToday}
        total={userScore?.startedCount}
      />
      <ButtonLinkRectangular to="/" buttonColor="color-secondary">
        Seznam gramatiky
      </ButtonLinkRectangular>
      <ButtonLinkRectangular to="/" buttonColor="color-secondary">
        Seznam slovíček
      </ButtonLinkRectangular>
    </div>
  );
}
