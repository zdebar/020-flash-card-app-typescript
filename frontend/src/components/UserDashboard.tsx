import Dashboard from './common/Dashboard';
import RectangularButton from './common/RectangularButton';

export default function UserDashboard() {
  return (
    <div className="w-full p-4">
      <div className="color-secondary w-full rounded-md">
        <RectangularButton to="/practice" className="rounded-md">
          Slovíčka
        </RectangularButton>
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}
