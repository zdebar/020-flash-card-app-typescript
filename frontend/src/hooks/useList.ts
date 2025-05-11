import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useList<T>(
  apiPath: string,
  calculateInitialLimit: () => number
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [listArray, setListArray] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(calculateInitialLimit());
  const [isLoading, setIsLoading] = useState(false);

  const calculateLimit = useCallback(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const itemHeight = 28;
      const calculatedLimit = Math.floor(containerHeight / itemHeight);
      setLimit(calculatedLimit);
    }
  }, []);

  const fetchAndStoreItems = useCallback(
    async (page: number, limit: number) => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuthAndParse<{
          rows: T[];
          pagination: {
            page: number;
            limit: number;
            totalPages: number;
          };
        }>(`${apiPath}?page=${page}&limit=${limit}`);

        const items = data?.rows || [];
        setListArray(items);
        setCurrentPage(data?.pagination.page || 1);
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
    calculateLimit();
    window.addEventListener('resize', calculateLimit);

    return () => {
      window.removeEventListener('resize', calculateLimit);
    };
  }, [calculateLimit]);

  useEffect(() => {
    fetchAndStoreItems(1, limit);
  }, [apiPath, limit, fetchAndStoreItems]);

  const fetchPage = (page: number) => {
    if (!isLoading && page > 0 && page <= totalPages) {
      fetchAndStoreItems(page, limit);
    }
  };

  return {
    containerRef,
    listArray,
    fetchPage,
    currentPage,
    totalPages,
    isLoading,
    setLimit,
  };
}
