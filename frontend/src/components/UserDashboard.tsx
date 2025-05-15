import Dashboard from './common/Dashboard';
import { useUser } from '../hooks/useUser';
import ButtonLink from './common/ButtonLink';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="card">
      <ButtonLink to="/practice" className="button-rectangular">
        Procvičovat
      </ButtonLink>
      <Dashboard
        className="color-disabled shape-rectangular"
        started={userScore?.startedCount}
        total={userScore?.itemsTotal}
      />
    </div>
  );
}
