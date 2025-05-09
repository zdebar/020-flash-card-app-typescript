import { useState, useEffect, useCallback } from 'react';
import { Item, UserScore } from '../../../shared/types/dataTypes';
import {
  alternateDirection,
  convertToItemProgress,
} from '../utils/practice.utils';
import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useItemArray() {
  const [itemArray, setItemArray] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech

  const { setUserScore } = useUser();
  const navigate = useNavigate();

  const apiPath = '/api/items';

  useEffect(() => {
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
          } catch (error) {
            console.error('Error posting words:', error);
          }

          setItemArray([]);
          navigate('/userDashboard');
        } else {
          // Continue to the next item
          setCurrentIndex(currentIndex + 1);
          setDirection(alternateDirection(updatedItemArray, currentIndex + 1));
          setItemArray(updatedItemArray);
        }
      }
    },
    [itemArray, currentIndex, navigate, setUserScore, apiPath]
  );

  return {
    itemArray,
    currentIndex,
    direction,
    updateItemArray,
  };
}
