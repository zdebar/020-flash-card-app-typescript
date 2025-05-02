import { SlashBookmarkIcon } from './common/Icons';
import { fetchWordsAndCacheAudio } from '../utils/practice.utils';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word, UserScore } from '../../../shared/types/dataTypes';
import { postWords } from '../utils/postWords.utils';
import {
  alternateDirection,
  playAudioFromCache,
  convertToWordProgress,
  updateWordProgress,
} from '../utils/practice.utils';
import PracticeControls from './common/PracticeControls';
import { useUser } from '../hooks/useUser';
import config from '../config/config';
import Button from './common/Button';
import Card from './common/Card';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech
  const [revealed, setRevealed] = useState(false);
  const { setUserScore } = useUser(); // n
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const navigate = useNavigate();

  const saveAudioToUseRef = useCallback(
    (audioPath: string, audioBlob: Blob | MediaSource) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioCacheRef.current.set(audioPath, audio);
    },
    [audioCacheRef]
  );

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const words = await fetchWordsAndCacheAudio(
          `${config.Url}/api/words`,
          saveAudioToUseRef
        );
        setWordArray(words);
        setDirection(alternateDirection(words, 0));
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };

    fetchAndStoreWords();
    const currentRef = audioCacheRef.current;
    return () => {
      currentRef.clear();
    };
  }, [saveAudioToUseRef]);

  const playAudio = useCallback(() => {
    const audioPath = wordArray[currentIndex]?.audio || null;
    playAudioFromCache(audioCacheRef.current, audioPath);
  }, [wordArray, currentIndex]);

  useEffect(() => {
    if (!direction) {
      setTimeout(() => playAudio(), 100);
    }
  }, [direction, playAudio]);

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
      }
    }
  }

  function handleReveal() {
    setRevealed(true);
    if (direction) playAudio();
  }

  return (
    <div className="flex w-[320px] flex-col justify-center py-4 landscape:h-screen">
      <div className="flex flex-col gap-1">
        <Button onClick={() => updateWordArray(0, true)} color="secondary">
          <SlashBookmarkIcon></SlashBookmarkIcon>
        </Button>
        <Card
          currentIndex={currentIndex}
          wordArray={wordArray}
          direction={direction}
          revealed={revealed}
        ></Card>
        <PracticeControls
          revealed={revealed}
          direction={direction}
          handleAudio={() => playAudio()}
          handleReveal={handleReveal}
          handlePlus={() => updateWordArray(config.plusProgress)}
          handleMinus={() => updateWordArray(config.minusProgress)}
        />
      </div>
    </div>
  );
}
