import Dashboard from './common/Dashboard';
import ButtonLinkRectangular from './common/ButtonLinkRectangular';
import { useUser } from '../hooks/useUser';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="card">
      <ButtonLinkRectangular
        to="/overview/grammar"
        buttonColor="button-secondary"
      >
        <span className="w-42">Seznam gramatiky</span>
      </ButtonLinkRectangular>
      <ButtonLinkRectangular
        to="/overview/vocabulary"
        buttonColor="button-secondary"
      >
        <span className="w-42">Seznam slovíček</span>
      </ButtonLinkRectangular>
      <Dashboard
        className="color-disabled"
        today={userScore?.startedCountToday}
        total={userScore?.startedCount}
      />
      <ButtonLinkRectangular to="/practice">
        <span className="w-40">Procvičovat</span>
      </ButtonLinkRectangular>
    </div>
  );
}
