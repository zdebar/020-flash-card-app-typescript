import { useUser } from '../hooks/useUser';

export default function Dashboard() {
  const { userScore } = useUser();

  if (!userScore) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex w-full flex-col justify-center px-4 pb-4">
      <table className="w-full table-auto text-right">
        <tbody>
          <tr>
            <td className="text-left font-bold">započato</td>
            <td>{userScore.startedCountToday}</td>
            <td>{userScore.startedCount}</td>
          </tr>
          <tr>
            <td className="text-left font-bold">naučeno</td>
            <td>{userScore.learnedCountToday}</td>
            <td>{userScore.learnedCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
