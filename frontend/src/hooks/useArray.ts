import { useState, useEffect } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useUser } from '../hooks/useUser';

export function useArray<T>(apiPath: string) {
  const [array, setArray] = useState<T[]>([]);
  const [index, setIndex] = useState(0);
  const [reload, setReload] = useState(true);
  const { loading } = useUser();

  function wrapIndex(newIndex: number) {
    if (array.length === 0) return 0;
    return (newIndex + array.length) % array.length;
  }

  function nextIndex() {
    setIndex((prev) => wrapIndex(prev + 1));
  }

  function prevIndex() {
    setIndex((prev) => wrapIndex(prev - 1));
  }

  useEffect(() => {
    // data should be fetched / on mount, on reload state
    if (loading || !reload) return;

    const fetchData = async () => {
      try {
        const response = await fetchWithAuthAndParse<{
          data: T[] | null;
        }>(apiPath);

        setArray(response?.data || []);
      } catch (error) {
        console.error('Error in fetching data:', error);
        setArray([]);
      }
      setIndex(0);
      setReload(false);
    };
    fetchData();
  }, [loading, apiPath, reload]);

  return {
    array,
    setArray,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    currentItem: array[index],
    arrayLength: array.length,
    reload,
    setReload,
  };
}
