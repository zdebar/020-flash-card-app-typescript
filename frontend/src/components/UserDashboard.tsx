import { useUser } from '../hooks/useUser';
import ProgressBar from './common/ProgressBar.js';
import ButtonLink from './common/ButtonLink';
import LevelBar from './common/LevelBar';
import { useState } from 'react';
import GuideHint from './common/GuideHint';
import config from '../config/config.js';
import HelpOverlay from './common/HelpOverlay';

export default function UserDashboard() {
  const { userScore, languageID } = useUser();
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const currLanguage = userScore?.find(
    (lang) => lang.languageID === languageID
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
            text="jednotná sekvence učení slovíček a gramatiky"
            style={{
              top: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            className="w-100 text-center"
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
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            className="w-100 text-center"
          />
        </ButtonLink>
        <div
          className={`color-disabled relative flex h-full flex-col items-center justify-center`}
        >
          {currLanguage && (
            <>
              <p className="note">pokrok na posledních 2 úrovních</p>
              <LevelBar
                learned={currLanguage?.learnedCountByLevel ?? {}}
                learnedToday={currLanguage?.learnedCountTodayByLevel ?? {}}
                levels={currLanguage?.itemsCountByLevel ?? {}}
              />
            </>
          )}
          <p className="note">cvičební bloky za posledních 5 dní</p>
          {currLanguage &&
            currLanguage.blockCount.map((item, idx) => (
              <div
                key={idx}
                className="flex w-60 items-center justify-start gap-2"
              >
                <p className="w-8 text-right text-xs">{item}</p>
                <ProgressBar progress={item} maxProgress={config.dailyBlocks} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
