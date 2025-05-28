import { useEffect, useState, useCallback } from 'react';
import PracticeControls from './common/PracticeControls';
import config from '../config/config';
import Card from './common/Card';
import { useAudioManager } from '../hooks/useAudioManager';
import { useArray } from '../hooks/useArray';
import {
  PracticeError,
  Item,
  UserScore,
} from '../../../shared/types/dataTypes';
import { usePatchOnUnmount } from '../hooks/usePatchOnUnmount';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { alternateDirection } from '../utils/practice.utils';
import { useUser } from '../hooks/useUser';
import InfoCard from './InfoCard';
import Loading from './common/Loading';
import TopBar from './common/TopBar';

export default function PracticeCard() {
  const apiPath = '/api/items';
  const { array, index, nextIndex, arrayLength, setReload, currentItem } =
    useArray<Item>(apiPath);
  const { playAudio, setVolume, stopAudio, audioReload, setAudioReload } =
    useAudioManager(array);

  const [userProgress, setUserProgress] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [direction, setDirection] = useState(false);
  const [error, setError] = useState<PracticeError | null>(null);
  const { setUserScore } = useUser();

  // Sending user progress to the server
  const patchItems = useCallback(
    async (onBlockEnd: boolean, updatedProgress: number[]) => {
      const updatedArray = array
        .filter((_, idx) => idx < updatedProgress.length)
        .map((item, idx) => ({
          ...item,
          progress: updatedProgress[idx],
        }));

      if (updatedArray.length === 0) return;
      setUserProgress([]);

      try {
        const response = await fetchWithAuthAndParse<{
          score: UserScore | null;
        }>(apiPath, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: updatedArray,
            onBlockEnd,
          }),
        });

        const newUserScore = response?.score || null;
        setUserScore(newUserScore);
      } catch (error) {
        console.error('Error posting words:', error);
      }
    },
    [apiPath, setUserScore, array]
  );

  // Update userProgress, if end of array reached, patch items
  const updateItemArray = useCallback(
    async (progressIncrement: number = 0) => {
      setRevealed(false);
      stopAudio();

      const newProgress = Math.max(
        array[index].progress + progressIncrement,
        0
      );
      const updatedProgress = userProgress.concat(newProgress);

      if (arrayLength > 0) {
        if (index + 1 >= arrayLength) {
          await patchItems(true, updatedProgress);
          setAudioReload(true);
          setReload(true);
        } else {
          setUserProgress(updatedProgress);
          nextIndex();
        }
      }
    },
    [
      array,
      arrayLength,
      index,
      nextIndex,
      patchItems,
      setReload,
      setAudioReload,
      stopAudio,
      userProgress,
    ]
  );

  // Set direction based on current item progress, play audio if needed
  useEffect(() => {
    const newDirection = alternateDirection(currentItem?.progress);
    setDirection(newDirection);

    if (!newDirection && currentItem?.audio && !audioReload) {
      setTimeout(() => playAudio(currentItem.audio!), 100);
    }
  }, [currentItem, playAudio, audioReload]);

  // Patch items on unmount
  usePatchOnUnmount(patchItems, userProgress);

  // Error setter
  useEffect(() => {
    if (!currentItem?.audio) {
      setError(PracticeError.NoAudio);
    } else {
      setError(null);
    }
  }, [currentItem]);

  if (!arrayLength) return <Loading />;

  return (
    <>
      {infoVisibility ? (
        <InfoCard itemId={currentItem?.id} setVisibility={setInfoVisibility} />
      ) : (
        <div className="card">
          <TopBar
            item={currentItem}
            revelead={revealed}
            setInfoVisibility={setInfoVisibility}
          />
          <Card
            item={currentItem}
            index={index}
            total={arrayLength}
            direction={direction}
            revealed={revealed}
            hintIndex={hintIndex}
            setVolume={setVolume}
            error={error}
          ></Card>
          <PracticeControls
            revealed={revealed}
            direction={direction}
            noAudio={!currentItem?.audio}
            handleAudio={() =>
              currentItem?.audio && playAudio(currentItem.audio)
            }
            handleReveal={() => {
              setRevealed(true);
              if (direction && currentItem?.audio) playAudio(currentItem.audio);
              setHintIndex(0);
            }}
            handlePlus={() => {
              updateItemArray(config.plusProgress);
            }}
            handleMinus={() => {
              updateItemArray(config.minusProgress);
            }}
            handleHint={() => setHintIndex((prevIndex) => prevIndex + 1)}
          />
        </div>
      )}
    </>
  );
}
