import { useUser } from '../hooks/useUser';
import ProgressBar from './common/ProgressBar.js';
import ButtonLink from './common/ButtonLink';
import LevelBar from './common/LevelBar';

export default function UserDashboard() {
  const { userScore, languageID } = useUser();

  const currLanguage = userScore?.find(
    (lang) => lang.languageID === languageID
  );

  return (
    <div className="card">
      <ButtonLink to="/practice" className="button-rectangular flex-shrink-0">
        Procvičovat
      </ButtonLink>
      <ButtonLink
        to="/userOverview "
        className="button-rectangular flex-shrink-0"
      >
        Přehled
      </ButtonLink>
      <div
        className={`color-card shape-rectangular flex flex-col items-center justify-center pb-1`}
      >
        {currLanguage && (
          <>
            <p className="font-Mansalva py-2 pr-2 text-sm">
              pokrok na posledních 2 úrovních
            </p>
            <LevelBar
              learned={currLanguage?.learnedCountByLevel ?? {}}
              learnedToday={currLanguage?.learnedCountTodayByLevel ?? {}}
              levels={currLanguage?.itemsCountByLevel ?? {}}
            />
          </>
        )}
        <p className="font-Mansalva py-2 pr-2 text-sm">
          cvičební bloky za posledních 5 dní
        </p>
        {currLanguage &&
          currLanguage.blockCount.map((item, idx) => (
            <div
              key={idx}
              className="flex w-60 items-center justify-start gap-2"
            >
              <p className="w-8 text-right text-xs">{item}</p>
              <ProgressBar progress={item} />
            </div>
          ))}
      </div>
    </div>
  );
}
