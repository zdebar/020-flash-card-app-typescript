import { useOverview } from '../hooks/useOverview';
import { Item } from '../../../shared/types/dataTypes';

export function Words() {
  const { overviewArray, fetchNextPage, hasMore, isLoading } =
    useOverview<Item>('/api/items/words');

  return (
    <div>
      <h1>Words Overview</h1>
      <ul>
        {overviewArray.map((item) => (
          <li key={item.id}>{item.english}</li>
        ))}
      </ul>
      {hasMore && !isLoading && (
        <button onClick={fetchNextPage}>Load More</button>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
