export default function Dashboard({
  today,
  total,
  className = '',
}: {
  today?: number;
  total?: number;
  className?: string;
}) {
  if (today === undefined || total === undefined) {
    return (
      <div className={`flex h-full w-full justify-between p-4 ${className}`}>
        data nejsou k dispozici
      </div>
    );
  }

  return (
    <div className={`flex h-full w-full justify-between p-4 ${className}`}>
      <p>dnes:</p>
      <div>{today}</div>
      <p>celkem:</p>
      <p>{total}</p>
    </div>
  );
}
