import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useOverview<T>(apiPath: string) {
  const [overviewArray, setOverviewArray] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Add totalPages state
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndStoreItems = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuthAndParse<{
          data: T[] | null;
          totalPages: number; // Expect totalPages in the response
        }>(`${apiPath}?page=${page}`);

        const items = data?.data || [];
        setOverviewArray(items); // Replace items instead of appending
        setTotalPages(data?.totalPages || 1); // Update totalPages
      } catch (error) {
        console.error('Error in fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiPath]
  );

  useEffect(() => {
    setOverviewArray([]);
    setCurrentPage(1);
    fetchAndStoreItems(1);
  }, [apiPath, fetchAndStoreItems]);

  const fetchPage = (page: number) => {
    if (!isLoading && page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchAndStoreItems(page);
    }
  };

  return {
    overviewArray,
    fetchPage,
    currentPage,
    totalPages,
    isLoading,
  };
}
