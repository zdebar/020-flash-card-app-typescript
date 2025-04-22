import { useUser } from '../hooks/useUser';

export default function Dashboard() {
  const { userScore } = useUser();

  if (!userScore) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>CEFR</th>
            <th>Today</th>
            <th>Total</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {userScore.map((item, index) => (
            <tr key={index}>
              <td>{item.cefr_level}</td>
              <td>{item.startedCountToday}</td>
              <td>{item.startedCount}</td>
              <td>{item.Count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
