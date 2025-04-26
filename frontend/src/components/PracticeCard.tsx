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
import ButtonOnClick from './ButtonOnClick';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<WordTransfer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech
  const [revealed, setRevealed] = useState(false);
  const [showNoteCard, setShowNoteCard] = useState(false);
  const [navigateToDashboard, setNavigateToDashboard] = useState(false);
  const { setUserScore } = useUser();
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
        const response = await fetchWithAuth(`${config.Url}/api/words`);
        if (response.ok) {
          const words: WordTransfer[] = await response.json();
          setWordArray(words);
          // setDirection(words[0]?.progress % 2 === 0);

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
                    saveAudioToUseRef(audioPath, audioBlob);
                  }
                }
              } else {
                const audioBlob = await cachedResponse.blob();
                saveAudioToUseRef(audioPath, audioBlob);
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
  }, [saveAudioToUseRef]);

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
      setTimeout(() => playAudio(), 100);
    }
  }, [direction, playAudio]);

  if (wordArray.length === 0) {
    return <p>No words to practice</p>;
  }

  function updateWordProgressAndNavigate(progress: number) {
    progress = Math.max(1, Math.min(progress, 100));
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
    <div className="w-[320px]">
      <div className="flex flex-col gap-1">
        <ButtonOnClick
          onClick={handleSkip}
          className={`color-secondary color-secondary-hover rounded-tr-md`}
        >
          <SlashBookmarkIcon></SlashBookmarkIcon>
        </ButtonOnClick>
        <button
          name="card"
          onClick={!revealed ? handleCard : undefined}
          className={`color-secondary flex h-[150px] w-full flex-col justify-between py-3 ${
            !revealed
              ? 'color-secondary-hover'
              : 'color-secondary-disabled shadow-none'
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
        <div className="flex w-full gap-1">
          <ButtonOnClick
            onClick={handleMinus}
            disabled={!revealed}
            className={`color-secondary ${revealed ? 'color-secondary-hover' : 'color-secondary-disabled shadow-none'}`}
          >
            <MinusIcon></MinusIcon>
          </ButtonOnClick>
          <ButtonOnClick
            onClick={handlePlus}
            disabled={!revealed}
            className={`color-secondary ${revealed ? 'color-secondary-hover' : 'color-secondary-disabled shadow-none'}`}
          >
            <PlusIcon></PlusIcon>
          </ButtonOnClick>
        </div>
        <ButtonOnClick
          onClick={handleAudio}
          disabled={direction && !revealed}
          className={`rounded-b-md ${
            !direction || revealed
              ? 'color-primary color-primary-hover'
              : 'color-secondary-disabled shadow-none'
          }`}
        >
          <AudioIcon></AudioIcon>
        </ButtonOnClick>
      </div>
      <div className="mt-20 flex justify-end p-4">
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
