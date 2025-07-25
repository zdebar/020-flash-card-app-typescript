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
      <ButtonLink to="/practice" className="button-rectangular">
        Procvičovat
      </ButtonLink>
      <ButtonLink to="/userOverview " className="button-rectangular">
        Přehled
      </ButtonLink>

      <div
        className={`color-card shape-rectangular flex flex-1 flex-col items-center justify-center pb-2`}
      >
        {currLanguage && (
          <LevelBar
            learned={currLanguage?.learnedCountByLevel ?? {}}
            learnedToday={currLanguage?.learnedCountTodayByLevel ?? {}}
            levels={currLanguage?.itemsCountByLevel ?? {}}
          />
        )}
        <p className="font-Mansalva py-2 text-sm">
          cvičební bloky za posledních 5 dní
        </p>
        {currLanguage &&
          currLanguage.blockCount.map((item, idx) => (
            <div
              key={idx}
              className="flex w-60 items-center justify-start gap-2 pr-8"
            >
              <p className="w-8 text-right text-xs">{item}</p>
              <ProgressBar progress={item} />
            </div>
          ))}
      </div>
    </div>
  );
}
