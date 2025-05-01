import { useUser } from '../../hooks/useUser';

export default function Dashboard() {
  const { userScore } = useUser();

  if (!userScore) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex w-full justify-between p-4 pt-2">
      <p>dnes:</p>
      <div>{userScore.startedCountToday}</div>
      <p>celkem:</p>
      <p>{userScore.startedCount}</p>
    </div>
  );
}
