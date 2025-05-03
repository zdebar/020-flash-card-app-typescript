import { useState, useEffect, useCallback } from 'react';
import { Word, UserScore } from '../../../shared/types/dataTypes';
import { fetchWithAuth } from '../utils/firebase.utils';
import { patchWords } from '../utils/postWords.utils';
import {
  alternateDirection,
  convertToWordProgress,
  updateWordProgress,
} from '../utils/practice.utils';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

export function useWordArray(fetchPath: string, patchPath: string) {
  const [wordArray, setWordArray] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech

  const { setUserScore } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const response = await fetchWithAuth(fetchPath);
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }

        const { words }: { words: Word[] } = await response.json();
        setWordArray(words);
        setDirection(alternateDirection(words, 0));
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };

    fetchAndStoreWords();
  }, [fetchPath]);

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
            const newUserScore: UserScore | null = await patchWords(
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
    [wordArray, currentIndex, navigate, setUserScore]
  );

  return {
    wordArray,
    currentIndex,
    direction,
    updateWordArray,
  };
}
