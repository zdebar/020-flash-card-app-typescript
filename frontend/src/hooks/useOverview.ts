import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useOverview<T>(apiPath: string) {
  const [overviewArray, setOverviewArray] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndStoreItems = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuthAndParse<{
          rows: T[];
          pagination: {
            page: number;
            limit: number;
            totalPages: number;
          };
        }>(`${apiPath}?page=${page}`);

        const items = data?.rows || [];
        setOverviewArray(items);
        setTotalPages(data?.pagination.totalPages || 1);
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
