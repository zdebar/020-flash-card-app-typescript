import BarFill from './BarFill';
import { useUser } from '../../hooks/useUser';

export default function Dashboard({
  started,
  total,
  className = '',
}: {
  started?: number;
  total?: number;
  className?: string;
}) {
  const { userScore } = useUser();
  if (started === undefined || total === undefined) {
    return (
      <div
        className={`flex h-full w-full flex-1 justify-between p-4 ${className}`}
      >
        data nejsou k dispozici
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-1 flex-col items-center justify-center gap-0 p-4 ${className}`}
    >
      {userScore &&
        userScore.blockCount.map((item, idx) => (
          <div className="flex items-center justify-center gap-2 pr-8">
            <p className="w-8 text-right text-xs">{item}</p>
            <BarFill key={idx} blocks={item} />
          </div>
        ))}
    </div>
  );
}
