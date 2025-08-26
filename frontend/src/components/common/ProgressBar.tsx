export default function ProgressBar({
  progress = 0,
  maxProgress = 100,
  newProgress = 0,
  divisions = 20,
}: {
  progress: number;
  maxProgress?: number;
  newProgress?: number;
  divisions?: number;
}) {
  const color = ['color-bar-1', 'color-bar-2', 'color-bar-3', 'color-bar-4'];
  const progressPercentage = (progress / maxProgress) * 100;
  const newProgressPercentage = (newProgress / maxProgress) * 100;

  const progressBlocks = Math.floor((progress * 4) / maxProgress);
  const divisionArray = [
    ...Array(progressBlocks).fill(25),
    ((progress - progressBlocks * (maxProgress / 4)) / maxProgress) * 100,
  ].slice(0, color.length);

  return (
    <div className={`relative z-4 h-2 w-40 border-r-1 dark:border-white`}>
      <div className="flex h-full w-full">
        {divisionArray.map((value, idx) => (
          <div
            key={idx}
            className={`top-0 z-0 h-full w-full ${color[idx]}`}
            style={{
              width: `${value}%`,
            }}
          ></div>
        ))}
      </div>

      <div
        className={`color-progress absolute top-0 z-0 h-full`}
        style={{
          width: `${newProgressPercentage}%`,
          left: `${progressPercentage}%`,
        }}
      ></div>
      {[...Array(divisions)].map((_, idx) => {
        return (
          <div
            key={idx}
            className={`absolute top-0 z-4 h-full border-l-1`}
            style={{ left: `${(idx * 100) / divisions}%` }}
          ></div>
        );
      })}
    </div>
  );
}
