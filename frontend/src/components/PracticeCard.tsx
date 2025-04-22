import { RefreshIcon, CheckIcon } from './Icons';
import { fetchWithAuth } from '../utils/firebase.utils';
import { useState, useEffect, useRef } from 'react';
import { WordPractice } from '../../../shared/types/dataTypes';
import { upgradeWords } from '../utils/upgradeWords';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<WordPractice[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [firstRound, setFirstRound] = useState(true);
  const audioCache = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const response = await fetchWithAuth(
          `http://localhost:3000/practice/getWords`
        );
        if (response.ok) {
          const words: WordPractice[] = await response.json();
          setCurrentIndex(0);
          setWordArray(words);
          // setFirstRound(true);
          // setRevealed(false);
        }
      } catch (error) {
        console.error('Practice Card - fetchAndStoreWords:', error);
      }
    };

    fetchAndStoreWords();
  }, []);

  if (!wordArray || wordArray.length === 0) {
    return <p>No words to practice</p>;
  }

  const handleCard = async () => {
    setRevealed(true);

    if (wordArray[currentIndex]?.audio) {
      const audioPath = wordArray[currentIndex].audio;

      try {
        if (!audioCache.current[audioPath]) {
          const response = await fetch(
            `http://localhost:3000/audio${audioPath}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
          }

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          audioCache.current[audioPath] = audioUrl;
        }

        const audio = new Audio(audioCache.current[audioPath]);
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    }
  };

  const handleEndOfArray = () => {
    let isFirstRun = firstRound;

    if (currentIndex === wordArray.length - 1) {
      setFirstRound(false);
      isFirstRun = false;
    }

    let nextIndex = (currentIndex + 1) % wordArray.length;

    if (!isFirstRun) {
      const progress0 = wordArray.filter((word) => word.progress === 0);

      while (progress0.length > 0 && wordArray[nextIndex].progress > 0) {
        nextIndex = (nextIndex + 1) % wordArray.length;
      }

      if (progress0.length === 0) {
        upgradeWords(
          wordArray.map((word) => ({
            id: word.id,
            progress: word.progress,
          }))
        );
        setWordArray(null);
      }
    }

    setCurrentIndex(nextIndex);
  };

  const handleProgressUpdate = async (action: 'refresh' | 'check') => {
    const updatedWordArray = [...wordArray];

    if (action === 'refresh') {
      updatedWordArray[currentIndex].progress = 0;
    } else if (action === 'check') {
      updatedWordArray[currentIndex].progress++;
    }

    setWordArray(updatedWordArray);
    handleEndOfArray();
    setRevealed(false);
  };

  return (
    <div className="w-[320px]">
      <button
        name="note"
        onClick={handleCard}
        className="color-secondary color-secondary-hover flex h-[120px] w-full flex-col items-center justify-evenly rounded-t-md py-4"
      >
        <p className="font-bold">
          {wordArray[currentIndex]
            ? wordArray[currentIndex].czech
            : 'For more words press practice'}
        </p>
        <>
          <p>{revealed ? wordArray[currentIndex]?.english : '\u00A0'}</p>
          <p>{revealed ? wordArray[currentIndex]?.pronunciation : '\u00A0'}</p>
        </>
      </button>
      <div className="my-1 grid h-10 w-full grid-cols-2 gap-1">
        <button
          name="refresh"
          onClick={revealed ? () => handleProgressUpdate('refresh') : undefined}
          className={`color-secondary flex w-full items-center justify-center rounded-bl-md ${
            revealed ? 'color-secondary-hover' : 'shadow-none'
          }`}
        >
          <RefreshIcon className="size-5" />
        </button>
        <button
          name="check"
          onClick={revealed ? () => handleProgressUpdate('check') : undefined}
          className={`flex w-full items-center justify-center rounded-br-md ${
            revealed
              ? 'color-primary color-primary-hover'
              : 'color-secondary shadow-none'
          }`}
        >
          <CheckIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
