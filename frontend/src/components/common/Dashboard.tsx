export default function Dashboard({
  today,
  total,
}: {
  today?: number;
  total?: number;
}) {
  if (today === undefined || total === undefined) {
    return (
      <div className="flex h-12 w-full justify-between p-4 pt-2">
        data nejsou k dispozici
      </div>
    );
  }

  return (
    <div className="flex h-12 w-full justify-between p-4 pt-2">
      <p>dnes:</p>
      <div>{today}</div>
      <p>celkem:</p>
      <p>{total}</p>
    </div>
  );
}
