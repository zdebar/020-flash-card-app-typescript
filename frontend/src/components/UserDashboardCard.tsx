import Dashboard from './common/Dashboard';
import RectangularButtonLink from './common/RectangularButtonLink';

export default function UserDashboardCard() {
  return (
    <div className="w-full p-4">
      <div className="color-secondary w-full rounded-md">
        <RectangularButtonLink to="/practice" className="rounded-md">
          Slovíčka
        </RectangularButtonLink>
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}
