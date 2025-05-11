import { useList } from '../hooks/useList';
import { Block } from '../../../shared/types/dataTypes';

export function Grammars() {
  const { overviewArray, fetchNextPage, hasMore, isLoading } = useList<Block>(
    '/api/blocks/grammar'
  );

  return (
    <div>
      <h1>Grammar Overview</h1>
      <ul>
        {overviewArray.map((block) => (
          <li key={block.block_id}>{block.block_name}</li>
        ))}
      </ul>
      {hasMore && !isLoading && (
        <button onClick={fetchNextPage}>Load More</button>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
