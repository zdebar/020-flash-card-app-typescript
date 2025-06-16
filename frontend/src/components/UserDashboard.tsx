import { useUser } from '../hooks/useUser';

import DashboardBar from './common/DashboardBar';
import ButtonLink from './common/ButtonLink';
import LanguageBar from './common/languageBar';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="card">
      <ButtonLink
        to="/practice"
        className="button-rectangular"
        buttonColor="color-secondary"
      >
        Procvičovat
      </ButtonLink>
      <ButtonLink to="/grammarList" className="button-rectangular">
        Přehled gramatiky
      </ButtonLink>

      <div
        className={`color-disabled shape-rectangular flex flex-1 flex-col items-center justify-center pb-2`}
      >
        {userScore && (
          <LanguageBar
            learned={userScore?.learnedCountByLevel ?? {}}
            learnedToday={userScore?.learnedCountTodayByLevel ?? {}}
            levels={userScore?.itemsCountByLevel ?? {}}
          />
        )}
        <p className="font-display py-2">cvičební bloky za posledních 5 dní</p>
        {userScore &&
          userScore.blockCount.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center gap-2 pr-8"
            >
              <p className="w-8 text-right text-xs">{item}</p>
              <DashboardBar blocks={item} />
            </div>
          ))}
      </div>
    </div>
  );
}
