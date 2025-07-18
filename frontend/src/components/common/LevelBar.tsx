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
    <div className="flex w-60 flex-col items-start justify-center">
      {Object.keys(learned)
        .filter((key) => key !== 'none')
        .sort((a, b) => levelSort.indexOf(a) - levelSort.indexOf(b))
        .slice(-2) // Limit to last two levels in learning
        .map((key) => {
          return (
            <div key={key} className="flex items-center justify-start gap-2">
              <p className="w-8 text-right text-xs">{key}</p>
              <ProgressBar
                progress={learned[key]}
                maxProgress={levels[key]}
                newProgress={learnedToday[key]}
                divisions={20}
              />
              {learnedToday[key] > 0 && (
                <p className="color-learned-today text-xs font-bold">
                  +{learnedToday[key]}
                </p>
              )}
            </div>
          );
        })}
    </div>
  );
}
