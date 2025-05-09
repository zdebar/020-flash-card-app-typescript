import Dashboard from './common/Dashboard';
import ButtonLinkRectangular from './common/ButtonLinkRectangular';
import { useUser } from '../hooks/useUser';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="flex h-[320px] w-[320px] flex-col justify-between gap-1">
      <ButtonLinkRectangular to="/practice">
        <span className="w-40">Procvičovat</span>
      </ButtonLinkRectangular>
      <Dashboard
        className="color-secondary-disabled"
        today={userScore?.startedCountToday}
        total={userScore?.startedCount}
      />
      <ButtonLinkRectangular
        to="/overview/grammar"
        buttonColor="color-secondary"
      >
        <span className="w-42">Seznam gramatiky</span>
      </ButtonLinkRectangular>
      <ButtonLinkRectangular
        to="/overview/vocabulary"
        buttonColor="color-secondary"
      >
        <span className="w-42">Seznam slovíček</span>
      </ButtonLinkRectangular>
    </div>
  );
}
