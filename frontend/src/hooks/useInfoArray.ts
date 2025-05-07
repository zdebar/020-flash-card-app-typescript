import { useState, useEffect } from 'react';
import { ItemInfo } from '../../../shared/types/dataTypes';
// import { useNavigate } from 'react-router-dom';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useInfoArray(itemId: number) {
  const [infoArray, setInfoArray] = useState<ItemInfo[]>([]);
  const [infoIndex, setInfoIndex] = useState(0);

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const data = await fetchWithAuthAndParse<{
          itemInfo: ItemInfo[] | null;
        }>(`/api/items/${itemId}/info`);

        const items = data?.itemInfo || [];
        console.log('Fetched data:', items);
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
