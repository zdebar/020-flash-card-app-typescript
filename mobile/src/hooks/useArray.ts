import { useState, useEffect } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useUser } from '../hooks/useUser';

export function useArray<T>(apiPath: string, method: string = 'POST') {
  const [array, setArray] = useState<T[]>([]);
  const [index, setIndex] = useState(0);
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(false);
  const { userLoading } = useUser();

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
    if (userLoading || !reload) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuthAndParse<{
          data: T[] | null;
        }>(apiPath, {
          method,
        });

        setArray(response?.data || []);
      } catch (error) {
        console.error('Error in fetching data:', error);
        setArray([]);
      }
      setIndex(0);
      setReload(false);
      setLoading(false);
    };
    fetchData();
  }, [userLoading, apiPath, reload, method]);

  return {
    array,
    setArray,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    loading,
    currentItem: array[index],
    arrayLength: array.length,
    reload,
    setReload,
  };
}
