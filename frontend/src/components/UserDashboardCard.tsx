import Dashboard from './common/Dashboard';
import ButtonLink from './common/ButtonLink';
import { useUser } from '../hooks/useUser';

export default function UserDashboardCard() {
  const { userScore } = useUser();

  return (
    <div className="flex w-[320px] flex-col gap-4 py-4">
      <div className="color-secondary w-full rounded-md">
        <ButtonLink
          to="/pronunciation"
          className="rounded-t-md"
          shape="rectangular"
        >
          Výslovnost
        </ButtonLink>
        <Dashboard></Dashboard>
      </div>
      <div className="color-secondary w-full rounded-md">
        <ButtonLink
          to="/vocabulary"
          className="rounded-t-md"
          shape="rectangular"
        >
          Slovíčka
        </ButtonLink>
        <Dashboard></Dashboard>
      </div>
      <div className="color-secondary w-full rounded-md">
        <ButtonLink
          to="/grammar"
          className="rounded-t-md"
          shape="rectangular"
          isActive={
            !!userScore?.nextGrammarDate &&
            userScore.nextGrammarDate < new Date()
          }
        >
          Gramatika
        </ButtonLink>
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}
