import { getActiveLanguageLevel } from '../../utils/practice.utils';

export default function LanguageBar({
  learned,
  learnedToday,
}: {
  learned: number;
  learnedToday: number;
}) {
  const { level, thresholdDifference, wordsNotToday, wordsToday } =
    getActiveLanguageLevel(learned, learnedToday);

  const notTodayWidth = (wordsNotToday / thresholdDifference) * 100;
  const todayWidth = (wordsToday / thresholdDifference) * 100;

  return (
    <div className="flex items-center gap-2 pr-4 pb-2">
      <span className="text-sm">{level}</span>
      <div className="relative h-2 w-40 border-r border-l border-gray-300">
        <div
          className="absolute top-0 h-full bg-blue-500"
          style={{ width: `${notTodayWidth}%` }}
        ></div>
        <div
          className="absolute top-0 h-full bg-green-500"
          style={{ width: `${todayWidth}%`, left: `${notTodayWidth}%` }}
        >
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 transform text-xs text-green-500">
            +{wordsToday}
          </span>
        </div>
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="absolute top-0 h-full border-l border-gray-400"
            style={{ left: `${index * 5}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
