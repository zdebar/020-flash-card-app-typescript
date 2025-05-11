import Dashboard from './common/Dashboard';
import ButtonLinkRectangular from './common/ButtonLinkRectangular';
import { useUser } from '../hooks/useUser';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="card">
      <ButtonLinkRectangular to="/practice">
        <span className="w-40">Procvičovat</span>
      </ButtonLinkRectangular>
      <Dashboard
        className="color-disabled"
        today={userScore?.startedCountToday}
        total={userScore?.startedCount}
      />
      <ButtonLinkRectangular to="/grammars" buttonColor="button-secondary">
        <span className="w-42">Seznam gramatiky</span>
      </ButtonLinkRectangular>
      <ButtonLinkRectangular to="/words" buttonColor="button-secondary">
        <span className="w-42">Seznam slovíček</span>
      </ButtonLinkRectangular>
    </div>
  );
}
