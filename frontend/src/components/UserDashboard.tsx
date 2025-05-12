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
        started={userScore?.startedCount}
        total={userScore?.itemsTotal}
      />
    </div>
  );
}
