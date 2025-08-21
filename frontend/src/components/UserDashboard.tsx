import { useUser } from '../hooks/useUser';
import ProgressBar from './common/ProgressBar.js';
import ButtonLink from './common/ButtonLink';
import LevelBar from './common/LevelBar';
import { useState } from 'react';
import GuideHint from './common/GuideHint';
import config from '../config/config.js';
import HelpOverlay from './common/HelpOverlay';

export default function UserDashboard() {
  const { userScore, languageId } = useUser();
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const currLanguage = userScore?.find(
    (lang) => lang.languageId === languageId
  );

  return (
    <div className="help-overlay">
      <HelpOverlay
        name="showDashboardHelp"
        setIsHelpVisible={setIsHelpVisible}
      />
      <div className="card">
        <ButtonLink to="/practice" className="relative flex-shrink-0">
          Procvičovat
          <GuideHint
            visibility={isHelpVisible}
            text="učení slovíček a gramatiky"
            style={{
              top: '30px',
            }}
            className="w-80 text-center"
          />
        </ButtonLink>
        <ButtonLink to="/userOverview" className="relative flex-shrink-0">
          Přehled
          <GuideHint
            visibility={isHelpVisible}
            text={
              <>
                přehled gramatiky a slovíček
                <br />
                umožňuje restartovat jejich učení
              </>
            }
            style={{
              top: '30px',
            }}
            className="w-80 text-center"
          />
        </ButtonLink>
        <div
          className={`color-disabled relative flex h-full flex-col items-center justify-center`}
        >
          {currLanguage && (
            <>
              <p className="note">pokrok na posledních 4 úrovních</p>
              <LevelBar
                learned={currLanguage?.learnedCountByLevel ?? {}}
                learnedToday={currLanguage?.learnedCountTodayByLevel ?? {}}
                levels={currLanguage?.itemsCountByLevel ?? {}}
              />
            </>
          )}
          <p className="note">cvičební bloky za poslední 4 dny</p>
          {currLanguage &&
            Object.entries(currLanguage.blockCount)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 4)
              .map(([date, count]) => (
                <div
                  key={date}
                  className="flex w-60 items-center justify-start gap-2"
                >
                  <p className="w-8 text-right text-xs">{count}</p>
                  <ProgressBar
                    progress={count}
                    maxProgress={config.dailyBlocks}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
