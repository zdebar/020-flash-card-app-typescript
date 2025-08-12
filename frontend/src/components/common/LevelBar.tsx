import ProgressBar from './ProgressBar';

export default function LevelBar({
  learned,
  learnedToday,
  levels,
}: {
  learned: Record<string, number>;
  learnedToday: Record<string, number>;
  levels: Record<string, number>;
}) {
  return (
    <div className="w-60 flex-col">
      {Object.keys(learned)
        .filter((key) => key !== 'none')
        .slice(-4) // Limit to last two levels in learning
        .map((key) => {
          return (
            <div key={key} className="flex items-center justify-start gap-2">
              <p className="w-8 text-right text-xs">{key}</p>
              <ProgressBar
                progress={learned[key]}
                maxProgress={levels[key]}
                newProgress={learnedToday[key]}
              />
              {learnedToday[key] > 0 && (
                <p className="text-learned">+{learnedToday[key]}</p>
              )}
            </div>
          );
        })}
    </div>
  );
}
