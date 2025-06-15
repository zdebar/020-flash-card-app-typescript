export default function LanguageBar({
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
          const notTodayWidth = (learned[key] / levels[key]) * 100;
          const todayWidth = (learnedToday[key] / levels[key]) * 100;

          return (
            <div key={key} className="flex items-center gap-2 pr-2">
              <span className="w-10 text-right text-sm">{key}</span>
              <div className="relative h-2 w-40 border-r-1 border-white">
                <div
                  className="absolute top-0 h-full bg-blue-500"
                  style={{ width: `${notTodayWidth}%` }}
                ></div>

                {[...Array(20)].map((_, index) => (
                  <div
                    key={index}
                    className="absolute top-0 h-full border-l-1"
                    style={{ left: `${index * 5}%` }}
                  ></div>
                ))}
                <div
                  className="absolute top-0 h-full bg-green-500"
                  style={{ width: `${todayWidth}%`, left: `${notTodayWidth}%` }}
                ></div>
              </div>
              <span className="text-xs text-green-500">
                +{learnedToday[key]}
              </span>
            </div>
          );
        })}
    </div>
  );
}
