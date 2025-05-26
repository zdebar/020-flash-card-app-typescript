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
import { usePronunciation } from '../hooks/usePronunciation';

export default function PracticeCard() {
  const apiPath = '/api/items';
  const {
    array,
    setArray,
    index,
    nextIndex,
    arrayLength,
    setReload,
    reload,
    currentItem,
  } = useArray<Item>(apiPath);
  const { playAudio, setVolume, stopAudio } = useAudioManager(array);

  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [direction, setDirection] = useState(false);
  const [error, setError] = useState<PracticeError | null>(null);
  const { setUserScore } = useUser();
  const {
    similarity,
    isAudioChecking,
    isRecording,
    startRecording,
    stopRecording,
  } = usePronunciation();

  const patchItems = useCallback(
    async (onBlockEnd: boolean, updateArray: Item[]) => {
      try {
        const response = await fetchWithAuthAndParse<{
          score: UserScore | null;
        }>(apiPath, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: updateArray,
            onBlockEnd,
          }),
        });

        const newUserScore = response?.score || null;
        setUserScore(newUserScore);
      } catch (error) {
        console.error('Error posting words:', error);
      }
    },
    [apiPath, setUserScore]
  );

  const updateItemArray = useCallback(
    async (progressIncrement: number = 0) => {
      const updatedItemArray = [...array];

      stopAudio();

      if (!array[index]) return;
      updatedItemArray[index] = {
        ...updatedItemArray[index],
        progress: Math.max(array[index].progress + progressIncrement, 0),
      };

      if (arrayLength > 0) {
        if (index + 1 >= arrayLength) {
          await patchItems(true, updatedItemArray);
          setReload(true);
        } else {
          setArray(updatedItemArray);
          nextIndex();
        }
      }
    },
    [
      array,
      index,
      arrayLength,
      setArray,
      nextIndex,
      setReload,
      patchItems,
      stopAudio,
    ]
  );

  useEffect(() => {
    if (reload) return;

    const newDirection = alternateDirection(currentItem?.progress);
    setDirection(newDirection);

    if (!newDirection && currentItem?.audio) {
      setTimeout(() => playAudio(currentItem.audio!), 100);
    }
  }, [currentItem, reload, playAudio]);

  usePatchOnUnmount(patchItems, index, array);

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
            audioSimilarity={similarity}
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
              setRevealed(false);
            }}
            handleMinus={() => {
              updateItemArray(config.minusProgress);
              setRevealed(false);
            }}
            handleHint={() => setHintIndex((prevIndex) => prevIndex + 1)}
            isAudioChecking={isAudioChecking}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={() =>
              stopRecording(
                currentItem?.english || '',
                currentItem?.pronunciation || ''
              )
            }
          />
        </div>
      )}
    </>
  );
}
