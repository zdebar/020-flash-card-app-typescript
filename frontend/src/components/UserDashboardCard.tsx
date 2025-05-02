import Dashboard from './common/Dashboard';
import ButtonLink from './common/ButtonLink';
import { useUser } from '../hooks/useUser';

export default function UserDashboardCard() {
  const { userScore } = useUser();

  return (
    <div className="flex w-[320px] flex-col gap-1 py-4">
      <div className="color-secondary w-full">
        <ButtonLink to="/pronunciationList" shape="rectangular">
          Výslovnost
        </ButtonLink>
      </div>
      <div className="color-secondary w-full">
        <ButtonLink to="/vocabulary" shape="rectangular">
          Slovíčka
        </ButtonLink>
        <Dashboard></Dashboard>
      </div>
      <div className="color-secondary w-full">
        <ButtonLink
          to="/grammar"
          shape="rectangular"
          isActive={
            !!userScore?.nextGrammarDate &&
            new Date(userScore.nextGrammarDate).getTime() < Date.now()
          }
        >
          Gramatika
        </ButtonLink>
      </div>
    </div>
  );
}
