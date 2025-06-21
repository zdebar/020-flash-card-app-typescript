import { useUser } from '../hooks/useUser';
import ProgressBar from './common/ProgressBar.js';
import ButtonLink from './common/ButtonLink';
import LevelBar from './common/LevelBar';

export default function UserDashboard() {
  const { userScore } = useUser();

  return (
    <div className="card">
      <ButtonLink to="/practice" className="button-rectangular">
        Procvičovat
      </ButtonLink>
      <ButtonLink to="/grammarList " className="button-rectangular">
        Přehled gramatiky
      </ButtonLink>

      <div
        className={`color-card shape-rectangular flex flex-1 flex-col items-center justify-center pb-2`}
      >
        {userScore && (
          <LevelBar
            learned={userScore?.learnedCountByLevel ?? {}}
            learnedToday={userScore?.learnedCountTodayByLevel ?? {}}
            levels={userScore?.itemsCountByLevel ?? {}}
          />
        )}
        <p className="font-Mansalva py-2 text-sm">
          cvičební bloky za posledních 5 dní
        </p>
        {userScore &&
          userScore.blockCount.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center gap-2 pr-8"
            >
              <p className="w-8 text-right text-xs">{item}</p>
              <ProgressBar progress={item} />
            </div>
          ))}
      </div>
    </div>
  );
}
