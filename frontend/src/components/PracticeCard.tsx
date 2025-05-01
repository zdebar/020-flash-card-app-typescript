import {
  SlashBookmarkIcon,
  PlusIcon,
  MinusIcon,
  AudioIcon,
  MicrophoneIcon,
  EyeIcon,
} from './common/Icons';
import { fetchWithAuth } from '../utils/firebase.utils';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word, UserScore } from '../../../shared/types/dataTypes';
import { postWords } from '../utils/postWords.utils';
import { supabase } from '../utils/supabase.utils';

import { useUser } from '../hooks/useUser';
import config from '../config/config';
import Button from './common/Button';
import SkipWindow from './common/SkipWindow';

export default function PracticeCard() {
  const [wordArray, setWordArray] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech
  const [revealed, setRevealed] = useState(false);
  const [navigateToDashboard, setNavigateToDashboard] = useState(false);
  const [showSkipWindow, setShowSkipWindow] = useState(false);
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

  function decideDirection(words: Word[], index: number = 0) {
    return words[index]?.progress % 2 === 0;
  }

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      try {
        const response = await fetchWithAuth(`${config.Url}/api/words`);
        if (response.ok) {
          const { words }: { words: Word[] } = await response.json();
          setWordArray(words);
          setDirection(decideDirection(words, 0));

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
    return <p></p>;
  }

  async function updateWordArray(
    progressIncrement: number = 0,
    skipped: boolean = false
  ) {
    const updatedProgress = Math.max(
      0,
      Math.min(wordArray[currentIndex].progress + progressIncrement, 100)
    );

    const updatedWordArray = [...wordArray];
    updatedWordArray[currentIndex] = {
      ...updatedWordArray[currentIndex],
      progress: updatedProgress,
      skipped: skipped,
    };

    if (updatedWordArray.length > 0) {
      if (currentIndex + 1 >= updatedWordArray.length) {
        setWordArray([]);

        try {
          const newUserScore: UserScore | null = await postWords(
            updatedWordArray.map((word) => ({
              id: word.id,
              progress: word.progress,
              skipped: word.skipped,
            }))
          );

          setUserScore(newUserScore);
          setNavigateToDashboard(true);
        } catch (error) {
          console.error('Error posting words:', error);
        }
      } else {
        setCurrentIndex(currentIndex + 1);
        setDirection(decideDirection(updatedWordArray, currentIndex + 1));
        setRevealed(false);
        setWordArray(updatedWordArray);
      }
    }
  }

  function handleSkip() {
    setShowSkipWindow(true);
  }

  function confirmSkip() {
    setShowSkipWindow(false);
    updateWordArray(0, true);
  }

  function cancelSkip() {
    setShowSkipWindow(false);
  }

  function handleReveal() {
    setRevealed(true);
    if (direction) playAudio();
  }

  function handlePlus() {
    updateWordArray(config.plusProgress);
  }

  function handleMinus() {
    updateWordArray(config.minusProgress);
  }

  function handleAudio() {
    playAudio();
  }

  return (
    <div className="flex w-[320px] flex-col justify-center py-4 landscape:h-screen">
      {showSkipWindow && (
        <SkipWindow
          message={`Chcete skutečně vyřadit slovo "${wordArray[currentIndex].czech}"?`}
          onConfirm={confirmSkip}
          onCancel={cancelSkip}
        />
      )}
      <div className="flex flex-col gap-1">
        <Button onClick={handleSkip} color="secondary">
          <SlashBookmarkIcon></SlashBookmarkIcon>
        </Button>
        <button
          name="PracticeCard"
          className={`color-secondary flex h-[150px] w-full flex-col justify-between py-3 shadow-none`}
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
        <div className="flex w-full justify-between gap-1">
          <div className="flex w-full flex-col gap-1">
            <Button>
              <MicrophoneIcon></MicrophoneIcon>
            </Button>
            <Button onClick={handleAudio} isActive={!direction || revealed}>
              <AudioIcon></AudioIcon>
            </Button>
          </div>
          {!revealed ? (
            <div className="flex w-full flex-col gap-1">
              <Button onClick={handleReveal}>
                <EyeIcon></EyeIcon>
              </Button>
              <Button isActive={false}>
                <MinusIcon></MinusIcon>
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-1">
              <Button onClick={handlePlus} isActive={revealed}>
                <PlusIcon></PlusIcon>
              </Button>
              <Button onClick={handleMinus} isActive={revealed}>
                <MinusIcon></MinusIcon>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
