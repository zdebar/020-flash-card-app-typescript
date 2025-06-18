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
  const levelSort = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div className="flex flex-col items-start justify-start">
      {Object.keys(levels)
        .filter((key) => key !== 'none')
        .sort((a, b) => levelSort.indexOf(a) - levelSort.indexOf(b))
        .slice(-2)
        .map((key) => {
          return (
            <div key={key} className="flex items-center gap-2 pr-2">
              <span className="w-10 text-right text-sm">{key}</span>

              <ProgressBar
                progress={learned[key]}
                maxProgress={levels[key]}
                newProgress={learnedToday[key]}
                divisions={20}
                width="w-40"
              />

              <span className="text-xs text-green-500">
                +{learnedToday[key]}
              </span>
            </div>
          );
        })}
    </div>
  );
}
