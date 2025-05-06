import { useState, useEffect, useCallback } from 'react';
import { Item, UserScore } from '../../../shared/types/dataTypes';
import {
  alternateDirection,
  convertToItemProgress,
  updateItemObject,
} from '../utils/practice.utils';
import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export function useItemArray() {
  const [wordArray, setWordArray] = useState<Item[]>([]);
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
        setWordArray(items);
        setDirection(alternateDirection(items, 0));
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };

    fetchAndStoreWords();
  }, []);

  const updateWordArray = useCallback(
    async (progressIncrement: number = 0, skipped: boolean = false) => {
      const updatedWordArray = updateItemObject(
        wordArray,
        currentIndex,
        progressIncrement,
        skipped
      );

      if (updatedWordArray.length > 0) {
        if (currentIndex + 1 >= updatedWordArray.length) {
          setWordArray([]);

          try {
            const data = await fetchWithAuthAndParse<{
              score: UserScore | null;
            }>(apiPath, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(convertToItemProgress(updatedWordArray)),
            });

            const newUserScore = data?.score || null;
            setUserScore(newUserScore);
          } catch (error) {
            console.error('Error posting words:', error);
          }

          navigate('/userDashboard');
        } else {
          setCurrentIndex(currentIndex + 1);
          setDirection(alternateDirection(updatedWordArray, currentIndex + 1));
          setWordArray(updatedWordArray);
        }
      }
    },
    [wordArray, currentIndex, navigate, setUserScore, apiPath]
  );

  return {
    wordArray,
    currentIndex,
    direction,
    updateWordArray,
  };
}
