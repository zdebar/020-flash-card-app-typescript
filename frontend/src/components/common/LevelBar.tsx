import ProgressBar from './ProgressBar';
import config from '../../config/config';

export default function LevelBar({
  learned,
  learnedToday,
  levels,
}: {
  learned: Record<string, number>;
  learnedToday: Record<string, number>;
  levels: Record<string, number>;
}) {
  const levelSort = config.levelSort;

  return (
    <div className="flex flex-col items-start justify-start pr-1">
      {Object.keys(learned)
        .filter((key) => key !== 'none')
        .sort((a, b) => levelSort.indexOf(a) - levelSort.indexOf(b))
        .slice(-2) // Limit to last two levels in learning
        .map((key) => {
          return (
            <div key={key} className="flex items-center gap-2 pl-7">
              <p>
                <span className="w-10 text-right text-sm">{key}</span>
              </p>
              <ProgressBar
                progress={learned[key]}
                maxProgress={levels[key]}
                newProgress={learnedToday[key]}
                divisions={20}
                width="w-40"
              />
              {learnedToday[key] > 0 && (
                <p>
                  <span className={`color-learned-today text-xs font-bold`}>
                    +{learnedToday[key]}
                  </span>
                </p>
              )}
            </div>
          );
        })}
    </div>
  );
}
