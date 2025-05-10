import { useState, useEffect, useCallback } from 'react';
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
  const [startedCount, setStartedCount] = useState(0);

  const { setUserScore } = useUser();

  const apiPath = '/api/items';

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
        if (!itemArray[currentIndex]?.started) {
          setStartedCount((prevCount) => prevCount + 1);
        }

        if (currentIndex + 1 >= updatedItemArray.length) {
          // End of the array, update backend and navigate to userDashboard

          try {
            const data = await fetchWithAuthAndParse<{
              score: UserScore | null;
            }>(apiPath, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(convertToItemProgress(updatedItemArray)),
            });

            const newUserScore = data?.score || null;
            setUserScore(newUserScore);
            // Reset started count after posting
          } catch (error) {
            console.error('Error posting words:', error);
          }

          setStartedCount(0);
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
    [itemArray, currentIndex, setUserScore, apiPath]
  );

  return {
    itemArray,
    currentIndex,
    direction,
    updateItemArray,
    startedCount,
    setCurrentIndex,
  };
}
