import RectangularButton from './RectangularButton';
import Dashboard from './Dashboard';

export default function UserDashboard() {
  return (
    <div className="w-full p-4">
      <div className="color-secondary w-full rounded-md">
        <RectangularButton to="/practice">Slovíčka</RectangularButton>
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}
