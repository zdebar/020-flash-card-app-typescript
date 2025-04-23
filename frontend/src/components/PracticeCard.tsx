import {
  SlashBookmarkIcon,
  NoteIcon,
  PlusIcon,
  MinusIcon,
  AudioIcon,
} from './Icons';
import { fetchWithAuth } from '../utils/firebase.utils';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordTransfer, WordPractice } from '../../../shared/types/dataTypes';
import { upgradeWords } from '../utils/upgradeWords';
import RoundButton from './RoundButton';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<WordPractice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [count, setCount] = useState(0);
  const [direction, setDirection] = useState(true); // true = czech to english, false = english to czech
  const [revealed, setRevealed] = useState(false);
  const audioCache = useRef<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:3000/api/words`);
        if (response.ok) {
          const words: WordTransfer[] = await response.json();
          const wordsWithDone: WordPractice[] = words.map((word) => ({
            ...word,
            done: false,
          }));
          setCount(wordsWithDone.length);
          setWordArray(wordsWithDone);
        }
      } catch (error) {
        console.error('Error in fetchAndStoreWords:', error);
      }
    };

    fetchAndStoreWords();
  }, []);

  useEffect(() => {
    if (wordArray.length > 0) {
      const doneLength = wordArray.filter((word) => word.done).length;
      setDoneCount(doneLength);

      if (doneLength >= wordArray.length) {
        upgradeWords(
          wordArray.map((word) => ({
            id: word.id,
            progress: word.progress,
          }))
        );
        setWordArray([]);
        // navigate('/userDashboard');
      } else if (wordArray[currentIndex]?.done) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % wordArray.length);
      }

      setDirection(wordArray[currentIndex]?.progress % 2 === 0);
      setRevealed(false);
    }
  }, [wordArray, currentIndex]);

  if (wordArray.length === 0) {
    return <p>No words to practice</p>;
  }

  function increaseCurrentIndexByOne() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wordArray.length);
  }

  /**
   * Change word progress and done status
   */
  function changeWordProgress(progress: number, done: boolean) {
    const updatedWordArray = [...wordArray];
    updatedWordArray[currentIndex] = {
      ...updatedWordArray[currentIndex],
      progress: progress,
      done: done,
    };
    setWordArray(updatedWordArray);
  }

  function handleSkip() {
    changeWordProgress(100, true);
    increaseCurrentIndexByOne();
  }

  function handleCard() {
    setRevealed(true);
    playAudio();
  }

  function handlePlus() {
    const newProgress = wordArray[currentIndex].progress + 1;
    changeWordProgress(newProgress, true);
    increaseCurrentIndexByOne();
  }

  function handleMinus() {
    const newProgress = Math.max(wordArray[currentIndex].progress - 2, 0);
    changeWordProgress(newProgress, false);
    increaseCurrentIndexByOne();
  }

  function handleAudio() {
    playAudio();
  }

  async function playAudio() {
    if (wordArray[currentIndex]?.audio) {
      const audioPath = wordArray[currentIndex].audio;
      try {
        const cache = await caches.open('audio-cache');

        let response = await cache.match(audioPath);
        if (!response) {
          response = await fetchWithAuth(
            `http://localhost:3000/audio${audioPath}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
          }
          await cache.put(audioPath, response.clone());
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        audioCache.current[audioPath] = audioUrl;

        const audio = new Audio(audioUrl);
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      } catch (error) {
        console.error('Error fetching or playing audio:', error);
      }
    }
  }

  return (
    <div className="flex h-120 w-[320px] flex-col justify-between">
      <div className="">
        <button
          name="skip"
          onClick={handleSkip}
          className="color-secondary color-secondary-hover my-1 flex h-12 w-full items-center justify-center rounded-tr-md"
        >
          <SlashBookmarkIcon></SlashBookmarkIcon>
        </button>
        <button
          name="card"
          onClick={!revealed ? handleCard : undefined}
          className={`color-secondary flex h-[150px] w-full flex-col items-center justify-evenly py-6 ${
            !revealed ? 'color-secondary-hover' : 'shadow-none'
          } `}
        >
          <p className="flex w-full justify-end pr-4 text-sm">
            {doneCount} / {count}
          </p>
          <p className="font-bold">
            {wordArray[currentIndex]
              ? wordArray[currentIndex].czech
              : 'For more words press practice'}
          </p>
          <>
            <p>{revealed ? wordArray[currentIndex]?.english : '\u00A0'}</p>
            <p>
              {revealed ? wordArray[currentIndex]?.pronunciation : '\u00A0'}
            </p>
          </>
        </button>
        <div className="my-1 grid h-12 w-full grid-cols-2 gap-1">
          <button
            name="minus"
            onClick={revealed ? handleMinus : undefined}
            className={`color-secondary flex h-12 w-full items-center justify-center rounded-bl-md ${
              revealed ? 'color-secondary-hover' : 'shadow-none'
            }`}
          >
            <MinusIcon></MinusIcon>
          </button>
          <button
            name="plus"
            onClick={revealed ? handlePlus : undefined}
            className={`flex h-12 w-full items-center justify-center rounded-br-md ${
              revealed
                ? 'color-primary color-primary-hover'
                : 'color-secondary shadow-none'
            }`}
          >
            <PlusIcon></PlusIcon>
          </button>
        </div>
        <button
          name="audio"
          onClick={!direction || revealed ? handleAudio : undefined}
          className={`color-primary flex h-12 w-full items-center justify-center rounded-b-md ${
            !direction || revealed
              ? 'color-primary color-primary-hover'
              : 'color-secondary shadow-none'
          } `}
        >
          <AudioIcon></AudioIcon>
        </button>
      </div>
      <div className="flex justify-end p-4">
        <RoundButton to="/note">
          <NoteIcon></NoteIcon>
        </RoundButton>
      </div>
    </div>
  );
}
