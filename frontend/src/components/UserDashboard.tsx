import ButtonLink from './ButtonLink';
import Dashboard from './Dashboard';

export default function UserDashboard() {
  return (
    <div className="w-full p-4">
      <div className="color-secondary w-full rounded-md">
        <ButtonLink to="/practice">Slovíčka</ButtonLink>
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}
