import Dashboard from './common/Dashboard';
import ButtonLink from './common/ButtonLink';

export default function UserDashboardCard() {
  return (
    <div className="w-[320px] py-4">
      <div className="color-secondary w-full rounded-md">
        <ButtonLink to="/practice" className="rounded-t-md" shape="rectangular">
          Slovíčka
        </ButtonLink>
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}
