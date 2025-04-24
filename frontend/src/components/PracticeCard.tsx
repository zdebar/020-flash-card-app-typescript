import {
  SlashBookmarkIcon,
  NoteIcon,
  PlusIcon,
  MinusIcon,
  AudioIcon,
} from './Icons';
import { fetchWithAuth } from '../utils/firebase.utils';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordTransfer, Note } from '../../../shared/types/dataTypes';
import { postWords } from '../utils/postWords.utils';
import { supabase } from '../utils/supabase.utils';
import NoteCard from './NoteCard';
import { useUser } from '../hooks/useUser';
import config from '../config/config';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<WordTransfer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(true); // true = czech to english, false = english to czech
  const [revealed, setRevealed] = useState(false);
  const [showNoteCard, setShowNoteCard] = useState(false);
  const [navigateToDashboard, setNavigateToDashboard] = useState(false);
  const { setUserScore } = useUser();
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map()); // Store Audio objects
  const navigate = useNavigate();

  function saveAudioToRef(audioPath: string, audioBlob: Blob | MediaSource) {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audioCacheRef.current.set(audioPath, audio);
  }

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const response = await fetchWithAuth(`${config.Url}/api/words`);
        if (response.ok) {
          const words: WordTransfer[] = await response.json();
          setWordArray(words);

          const cache = await caches.open('audio-cache');

          for (const word of words) {
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
                    const clonedResponse = response.clone();
                    const audioBlob = await response.blob();
                    cache.put(audioPath, clonedResponse);
                    saveAudioToRef(audioPath, audioBlob);
                  }
                }
              } else {
                const audioBlob = await cachedResponse.blob();
                saveAudioToRef(audioPath, audioBlob);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchAndStoreWords:', error);
      }
    };

    fetchAndStoreWords();
    const currentRef = audioCacheRef.current;

    return () => {
      currentRef.clear();
    };
  }, []);

  useEffect(() => {
    if (navigateToDashboard) {
      navigate('/userDashboard');
    }
  }, [navigateToDashboard, navigate]);

  const playAudio = useCallback(() => {
    if (wordArray[currentIndex]?.audio) {
      const audioPath = wordArray[currentIndex].audio;
      const audio = audioCacheRef.current.get(audioPath);

      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      } else {
        console.error('Audio file not preloaded:', audioPath);
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

  function updateWordProgressAndNavigate(progress: number) {
    progress = Math.max(0, Math.min(progress, 100));
    setWordArray((prevWordArray) => {
      const updatedWordArray = [...prevWordArray];
      updatedWordArray[currentIndex] = {
        ...updatedWordArray[currentIndex],
        progress: progress,
      };

      if (updatedWordArray.length > 0) {
        if (currentIndex + 1 >= updatedWordArray.length) {
          setWordArray([]);
          setNavigateToDashboard(true);

          postWords(
            updatedWordArray.map((word) => ({
              id: word.id,
              progress: word.progress,
            })),
            setUserScore
          ).catch((error) => {
            console.error('Error posting words:', error);
          });
        } else {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          setDirection(updatedWordArray[newIndex]?.progress % 2 === 0);
          setRevealed(false);
        }
      }

      return updatedWordArray;
    });
  }

  function handleSkip() {
    updateWordProgressAndNavigate(config.skipProgress);
  }

  function handleCard() {
    setRevealed(true);
    if (direction) playAudio();
  }

  function handlePlus() {
    const newProgress = wordArray[currentIndex].progress + config.plusProgress;
    updateWordProgressAndNavigate(newProgress);
  }

  function handleMinus() {
    const newProgress = wordArray[currentIndex].progress + config.minusProgress;
    updateWordProgressAndNavigate(newProgress);
  }

  function handleAudio() {
    playAudio();
  }

  function handleNote() {
    setShowNoteCard(true);
  }

  function handleNoteClose() {
    setShowNoteCard(false);
  }

  async function handleNoteSend(note: Note) {
    try {
      const response = await fetchWithAuth(`http://localhost:3000/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        console.error('Failed to send note:', response.statusText);
      } else {
        console.log('Note sent successfully:', note);
      }
    } catch (error) {
      console.error('Error sending note:', error);
    }
    setShowNoteCard(false);
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
          className={`color-secondary flex h-[150px] w-full flex-col justify-between py-3 ${
            !revealed ? 'color-secondary-hover' : 'shadow-none'
          } `}
        >
          <p className="flex w-full justify-end pr-4 text-sm">
            {currentIndex + 1} / {wordArray.length}
          </p>
          <p className="pt-1 font-bold">
            {direction || revealed ? wordArray[currentIndex].czech : undefined}
          </p>
          <p>{revealed ? wordArray[currentIndex]?.english : '\u00A0'}</p>
          <p className="pb-1">
            {revealed ? wordArray[currentIndex]?.pronunciation : '\u00A0'}
          </p>
          <p className="flex w-full justify-start pl-6 text-sm">
            {revealed ? wordArray[currentIndex]?.progress : '\u00A0'}
          </p>
        </button>
        <div className="my-1 grid h-12 w-full grid-cols-2 gap-1">
          <button
            name="minus"
            onClick={revealed ? handleMinus : undefined}
            className={`color-secondary flex h-12 w-full items-center justify-center ${
              revealed ? 'color-secondary-hover' : 'shadow-none'
            }`}
          >
            <MinusIcon></MinusIcon>
          </button>
          <button
            name="plus"
            onClick={revealed ? handlePlus : undefined}
            className={`color-secondary flex h-12 w-full items-center justify-center ${
              revealed ? 'color-secondary-hover' : 'shadow-none'
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
        <button
          onClick={handleNote}
          className="color-secondary color-secondary-hover flex h-12 w-12 items-center justify-center rounded-full"
        >
          <NoteIcon></NoteIcon>
        </button>
      </div>
      {showNoteCard && (
        <NoteCard
          onClose={handleNoteClose}
          onSend={handleNoteSend}
          wordId={wordArray[currentIndex].id}
        />
      )}
    </div>
  );
}
