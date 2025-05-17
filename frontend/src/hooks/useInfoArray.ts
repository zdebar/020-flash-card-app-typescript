import { useState, useEffect } from 'react';
import { ItemInfo } from '../../../shared/types/dataTypes';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useInfoArray(itemId: number) {
  const [infoArray, setInfoArray] = useState<ItemInfo[]>([]);
  const [infoIndex, setInfoIndex] = useState(0);

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const data = await fetchWithAuthAndParse<{
          itemInfo: ItemInfo[] | null;
        }>(`/api/items/${itemId}/info`);

        const items = data?.itemInfo || [];
        setInfoArray(items);
        setInfoIndex(0);
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };

    fetchAndStoreWords();
  }, [itemId]);

  return {
    infoArray,
    infoIndex,
    setInfoIndex,
  };
}
