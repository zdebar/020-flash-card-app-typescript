import { RefreshIcon, CheckIcon } from './Icons';
import { getAPI } from '../functions/fetchData';
import { useState, useEffect, useRef } from 'react';
import { Word, User } from '../types/dataTypes';
import { postUpgradeWords } from '../functions/postData';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<Word[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [firstRound, setFirstRun] = useState(true);
  const audioCache = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    const API_PATH = `http://localhost:3000/practice/getUserWords?srcLanguage=2&trgLanguage=1`;

    const fetchAndStoreWords = async () => {
      try {
        const userWords = await getAPI<Word[]>(API_PATH, setWordArray);
        setWordArray(userWords);
      } catch (error) {
        console.error('Error fetching or loading words:', error);
      }
    };

    fetchAndStoreWords();
  }, []);

  if (!wordArray || wordArray.length === 0) {
    return <p>No words to practice</p>;
  }

  const handleReveal = async () => {
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
      setFirstRun(false);
      isFirstRun = false;
    }

    let nextIndex = (currentIndex + 1) % wordArray.length;

    if (!isFirstRun) {
      const progress0 = wordArray.filter((word) => word.progress === 0);

      while (progress0.length > 0 && wordArray[nextIndex].progress > 0) {
        nextIndex = (nextIndex + 1) % wordArray.length;
      }

      if (progress0.length === 0) {
        //   postUpgradeWords(
        //     wordArray.map((word) => ({ id: word.id, progress: word.progress }))
        //   );
        //   localStorage.removeItem('userWords');
        //   fetchAndSaveUserWords();
      }
    }

    setCurrentIndex(nextIndex);
  };

  const handleRefreshButton = async () => {
    const updatedWordArray = [...wordArray];
    updatedWordArray[currentIndex].progress = 0;
    setWordArray(updatedWordArray);
    handleEndOfArray();
    setRevealed(false);
  };

  const handleCheckButton = async () => {
    const updatedWordArray = [...wordArray];
    updatedWordArray[currentIndex].progress++;
    setWordArray(updatedWordArray);
    handleEndOfArray();
    setRevealed(false);
  };

  return (
    <div className="w-[320px]">
      <button
        name="note"
        onClick={handleReveal}
        className="color-secondary color-secondary-hover flex h-[120px] w-full flex-col items-center justify-evenly rounded-t-md py-4"
      >
        <p className="font-bold">
          {wordArray[currentIndex]
            ? wordArray[currentIndex].src
            : 'For more words press practice'}
        </p>
        <>
          <p>{revealed ? wordArray[currentIndex]?.trg : '\u00A0'}</p>
          <p>{revealed ? wordArray[currentIndex]?.prn : '\u00A0'}</p>
        </>
      </button>
      <div className="my-1 grid h-10 w-full grid-cols-2 gap-1">
        <button
          name="refresh"
          onClick={revealed ? handleRefreshButton : undefined}
          className={`color-secondary flex w-full items-center justify-center rounded-bl-md ${
            revealed ? 'color-secondary-hover' : 'shadow-none'
          }`}
        >
          <RefreshIcon className="size-5" />
        </button>
        <button
          name="check"
          onClick={revealed ? handleCheckButton : undefined}
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
