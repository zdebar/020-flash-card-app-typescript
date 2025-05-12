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
      className={`flex h-full w-full flex-1 justify-center p-4 ${className}`}
    >
      <div>{`${started} / ${total}`}</div>
    </div>
  );
}
