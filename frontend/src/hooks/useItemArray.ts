import { useState, useEffect, useCallback, useRef } from 'react';
import { Item, UserScore } from '../../../shared/types/dataTypes';
import {
  alternateDirection,
  convertToItemProgress,
} from '../utils/practice.utils';
import { useUser } from './useUser';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useItemArray() {
  const [itemArray, setItemArray] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech

  const { setUserScore } = useUser();

  const apiPath = '/api/items';

  const updateServer = useCallback(async () => {
    try {
      const response = await fetchWithAuthAndParse<{
        score: UserScore | null;
      }>(apiPath, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(convertToItemProgress(itemArray)),
      });

      const newUserScore = response?.score || null;
      setUserScore(newUserScore);
    } catch (error) {
      console.error('Error posting words:', error);
    }
  }, [itemArray, apiPath, setUserScore]);

  // Fetch items on mount or when currentIndex is 0
  useEffect(() => {
    if (currentIndex === 0) {
      const fetchAndStoreWords = async () => {
        try {
          const data = await fetchWithAuthAndParse<{
            items: Item[] | null;
          }>(apiPath);

          const items = data?.items || [];
          setItemArray(items);
          setDirection(alternateDirection(items, 0));
        } catch (error) {
          console.error('Error in fetching data:', error);
        }
      };

      fetchAndStoreWords();
    }
  }, [currentIndex]);

  // Update items on unmount - Ref, Update Ref, Effect on unmount
  const updateItemsRef = useRef(updateServer);
  const updateIndexRef = useRef(currentIndex);

  useEffect(() => {
    updateItemsRef.current = updateServer;
  }, [updateServer]);

  useEffect(() => {
    updateIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (updateIndexRef.current != 0) {
        updateItemsRef.current();
      }
    };
  }, []);

  const updateItemArray = useCallback(
    async (progressIncrement: number = 0, skipped: boolean = false) => {
      // Update the current item in the array useState
      const updatedItemArray = [...itemArray];
      updatedItemArray[currentIndex] = {
        ...updatedItemArray[currentIndex],
        progress: Math.max(
          itemArray[currentIndex].progress + progressIncrement,
          0
        ),
        skipped: skipped,
      };

      if (updatedItemArray.length > 0) {
        if (currentIndex + 1 >= updatedItemArray.length) {
          // End of the array, update backend and navigate to userDashboard
          updateItemsRef.current();

          setCurrentIndex(0);
          setDirection(false);
        } else {
          // Continue to the next item
          setCurrentIndex(currentIndex + 1);
          setDirection(alternateDirection(updatedItemArray, currentIndex + 1));
          setItemArray(updatedItemArray);
        }
      }
    },
    [itemArray, currentIndex]
  );

  return {
    itemArray,
    currentIndex,
    direction,
    updateItemArray,
    setCurrentIndex,
  };
}
