import { fetchWithAuth } from '../utils/firebase.utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word, UserScore } from '../../../shared/types/dataTypes';

import { postWords } from '../utils/postWords.utils';
import {
  alternateDirection,
  convertToWordProgress,
  updateWordProgress,
} from '../utils/practice.utils';
import PracticeControls from './common/PracticeControls';
import { useUser } from '../hooks/useUser';
import config from '../config/config';
import SkipControl from './common/SkipControl';
import Card from './common/Card';
import { useHint } from '../hooks/useHint';
import { useAudioManager } from '../hooks/useAudioManager';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech
  const [revealed, setRevealed] = useState(false);

  const navigate = useNavigate();

  const { setUserScore } = useUser();
  const { hintIndex, handleHint, resetHint } = useHint();
  const { playAudio } = useAudioManager(wordArray);

  const currentAudio = wordArray[currentIndex]?.audio || null;

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const response = await fetchWithAuth(`${config.Url}/api/words`);
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
  }, []);

  useEffect(() => {
    if (!direction) {
      setTimeout(() => playAudio(currentAudio), 100);
    }
  }, [direction, playAudio, currentAudio]);

  if (wordArray.length === 0) {
    return <p>Loading..</p>;
  }

  async function updateWordArray(
    progressIncrement: number = 0,
    skipped: boolean = false
  ) {
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
          const newUserScore: UserScore | null = await postWords(
            convertToWordProgress(updatedWordArray)
          );

          setUserScore(newUserScore);
        } catch (error) {
          console.error('Error posting words:', error);
        }

        navigate('/userDashboard');
      } else {
        setCurrentIndex(currentIndex + 1);
        setDirection(alternateDirection(updatedWordArray, currentIndex + 1));
        setRevealed(false);
        setWordArray(updatedWordArray);
        resetHint();
      }
    }
  }

  function handleReveal() {
    setRevealed(true);
    if (direction) playAudio(currentAudio);
  }

  return (
    <div className="flex w-[320px] flex-col justify-center py-4">
      <div className="flex flex-col gap-1">
        <SkipControl handleSkip={() => updateWordArray(0, true)} />
        <Card
          currentIndex={currentIndex}
          wordArray={wordArray}
          direction={direction}
          revealed={revealed}
          hintIndex={hintIndex}
        ></Card>
        <PracticeControls
          revealed={revealed}
          direction={direction}
          handleAudio={() => playAudio(currentAudio)}
          handleReveal={handleReveal}
          handlePlus={() => updateWordArray(config.plusProgress)}
          handleMinus={() => updateWordArray(config.minusProgress)}
          handleHint={() => handleHint()}
        />
      </div>
    </div>
  );
}
