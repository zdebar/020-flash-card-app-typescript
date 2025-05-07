import { useState, useEffect } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useOverview<T>(apiPath: string) {
  const [overviewArray, setOverviewArray] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndStoreItems = async (page: number) => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuthAndParse<{
        data: T[] | null;
        hasMore: boolean;
      }>(`${apiPath}?page=${page}`);

      const items = data?.data || [];
      setOverviewArray((prev) => [...prev, ...items]);
      setHasMore(data?.hasMore ?? false);
    } catch (error) {
      console.error('Error in fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOverviewArray([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchAndStoreItems(1);
  }, [apiPath]);

  const fetchNextPage = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAndStoreItems(nextPage);
    }
  };

  return {
    overviewArray,
    fetchNextPage,
    hasMore,
    isLoading,
  };
}
