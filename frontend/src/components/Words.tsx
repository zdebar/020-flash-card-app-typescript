import { useOverview } from '../hooks/useOverview';
import { Item } from '../../../shared/types/dataTypes';

export function Words() {
  const { overviewArray, fetchPage, currentPage, totalPages, isLoading } =
    useOverview<Item>('/api/items/words');

  return (
    <div>
      <h1>Words Overview</h1>
      <ul>
        {overviewArray.map((item) => (
          <li key={item.id}>{item.english}</li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => fetchPage(currentPage - 1)}
          disabled={isLoading || currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => fetchPage(currentPage + 1)}
          disabled={isLoading || currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
