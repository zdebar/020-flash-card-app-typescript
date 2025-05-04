import { useState, useEffect, useCallback } from 'react';
import { Item, UserScore } from '../../../shared/types/dataTypes';
import { patchData } from '../utils/patchData.utils';
import {
  alternateDirection,
  convertToWordProgress,
  updateWordProgress,
} from '../utils/practice.utils';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

export function useWordArray(patchPath: string) {
  const [wordArray, setWordArray] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech

  const { setUserScore } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setDirection(alternateDirection(wordArray, 0));
  }, [wordArray]);

  const updateWordArray = useCallback(
    async (progressIncrement: number = 0, skipped: boolean = false) => {
      const updatedWordArray = updateWordProgress(
        wordArray,
        currentIndex,
        progressIncrement,
        skipped
      );

      if (updatedWordArray.length > 0) {
        if (currentIndex + 1 >= updatedWordArray.length) {
          setWordArray([]);

          try {
            const newUserScore: UserScore | null = await patchData(
              convertToWordProgress(updatedWordArray),
              patchPath
            );

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
    [wordArray, currentIndex, navigate, setUserScore, patchPath]
  );

  return {
    wordArray,
    setWordArray,
    currentIndex,
    direction,
    updateWordArray,
  };
}
