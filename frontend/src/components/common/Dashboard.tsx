import BarFill from './BarFill';

export default function Dashboard({
  started,
  total,
  className = '',
}: {
  started?: number;
  total?: number;
  className?: string;
}) {
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
      className={`flex h-full w-full flex-1 flex-col items-center justify-start gap-1 p-4 ${className}`}
    >
      <div className="items-center">{`${started} / ${total}`}</div>
      <BarFill blocks={started} />
    </div>
  );
}
