import {
  SlashBookmarkIcon,
  NoteIcon,
  PlusIcon,
  MinusIcon,
  AudioIcon,
} from './Icons';
import { fetchWithAuth } from '../utils/firebase.utils';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordTransfer, WordPractice } from '../../../shared/types/dataTypes';
import { endPracticeSession } from '../utils/upgradeWords';
import RoundButton from './RoundButton';
import { supabase } from '../utils/supabase.utils';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<WordPractice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [count, setCount] = useState(0);
  const [direction, setDirection] = useState(true); // true = czech to english, false = english to czech
  const [revealed, setRevealed] = useState(false);
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

          // Pre-fetch and cache audio files
          const cache = await caches.open('audio-cache');
          for (const word of wordsWithDone) {
            if (word.audio) {
              const audioPath = word.audio;
              const cachedResponse = await cache.match(audioPath);
              if (!cachedResponse) {
                const { data } = supabase.storage
                  .from('audio-files')
                  .getPublicUrl(audioPath);

                if (data.publicUrl) {
                  const response = await fetch(data.publicUrl);
                  if (response.ok) {
                    cache.put(audioPath, response.clone());
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchAndStoreWords:', error);
      }
    };

    fetchAndStoreWords();
  }, []);

  const playAudio = useCallback(async () => {
    if (wordArray[currentIndex]?.audio) {
      const audioPath = wordArray[currentIndex].audio;

      try {
        // Open the browser cache
        const cache = await caches.open('audio-cache');

        // Check if the audio file is already cached
        const cachedResponse = await cache.match(audioPath);
        if (cachedResponse) {
          const audioBlob = await cachedResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play().catch((error) => {
            console.error('Error playing cached audio:', error);
          });
          return;
        }

        // If not cached, fetch the audio file from Supabase
        const { data } = supabase.storage
          .from('audio-files')
          .getPublicUrl(audioPath);

        const audioUrl = data.publicUrl;

        // Fetch the audio file and cache it
        const response = await fetch(audioUrl);
        if (response.ok) {
          cache.put(audioPath, response.clone());
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        } else {
          console.error('Failed to fetch audio file:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching or playing audio:', error);
      }
    }
  }, [wordArray, currentIndex]);

  useEffect(() => {
    if (!direction) {
      setTimeout(() => playAudio(), 200);
    }
  }, [direction, playAudio]);

  if (wordArray.length === 0) {
    return <p>No words to practice</p>;
  }

  function changeWordProgress(progress: number, done: boolean) {
    setWordArray((prevWordArray) => {
      const updatedWordArray = [...prevWordArray];
      updatedWordArray[currentIndex] = {
        ...updatedWordArray[currentIndex],
        progress: progress,
        done: done,
      };
      prepareNextWord(updatedWordArray);
      return updatedWordArray;
    });
  }

  function prepareNextWord(updatedWordArray = wordArray) {
    if (updatedWordArray.length > 0) {
      const doneLength = updatedWordArray.filter((word) => word.done).length;

      if (doneLength >= updatedWordArray.length) {
        endPracticeSession(
          updatedWordArray.map((word) => ({
            id: word.id,
            progress: word.progress,
          }))
        );
        setWordArray([]);
        navigate('/userDashboard');
        return;
      }

      setDoneCount(doneLength);
      let newIndex = currentIndex;
      do {
        newIndex = (newIndex + 1) % updatedWordArray.length;
      } while (updatedWordArray[newIndex]?.done);
      setCurrentIndex(newIndex);
      setDirection(updatedWordArray[newIndex]?.progress % 2 === 0);
      setRevealed(false);
    }
  }

  function handleSkip() {
    changeWordProgress(100, true);
  }

  function handleCard() {
    setRevealed(true);
    playAudio();
  }

  function handlePlus() {
    const newProgress = wordArray[currentIndex].progress + 1;
    changeWordProgress(newProgress, true);
  }

  function handleMinus() {
    const newProgress = Math.max(wordArray[currentIndex].progress - 2, 0);
    changeWordProgress(newProgress, false);
  }

  function handleAudio() {
    playAudio();
  }

  function handleNote() {}

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
            {direction || revealed ? wordArray[currentIndex].czech : undefined}
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
        <RoundButton onClick={handleNote}>
          <NoteIcon></NoteIcon>
        </RoundButton>
      </div>
    </div>
  );
}
