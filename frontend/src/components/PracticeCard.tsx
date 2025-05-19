import { useEffect, useState } from 'react';
import PracticeControls from './common/PracticeControls';
import config from '../config/config';
import Card from './common/Card';
import { useAudioManager } from '../hooks/useAudioManager';
import { useItemArray } from '../hooks/useItemArray';
import { useAutoPlayAudioOnDirection } from '../hooks/useAutoPlayAudioOnDirection';
import { PracticeError } from '../../../shared/types/dataTypes';
import InfoCard from './InfoCard';
import Loading from './common/Loading';
import TopBar from './common/TopBar';
import { alternateDirection } from '../utils/practice.utils';

export default function PracticeCard() {
  const { itemArray, currentItem, index, itemArrayLength, updateItemArray } =
    useItemArray();
  const { playAudio, setVolume, stopAudio } = useAudioManager(itemArray);

  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [direction, setDirection] = useState(false);
  const [error, setError] = useState<PracticeError | null>(null);

  useEffect(() => {
    // Error setter
    if (!currentItem?.audio) {
      setError(PracticeError.NoAudio);
    } else {
      setError(null);
    }
  }, [currentItem]);

  useAutoPlayAudioOnDirection(direction, playAudio, currentItem?.audio);

  function handleNext() {
    setRevealed(false);
    stopAudio();
    setDirection(alternateDirection(currentItem?.progress)); // true = czech to english, false = english to czech
  }

  function handleReveal() {
    setRevealed(true);
    if (direction && currentItem?.audio) playAudio(currentItem.audio);
    setHintIndex(0);
  }

  if (!itemArrayLength) return <Loading />;

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
            total={itemArrayLength}
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
            handleReveal={handleReveal}
            handlePlus={() => {
              updateItemArray(config.plusProgress);
              handleNext();
            }}
            handleMinus={() => {
              updateItemArray(config.minusProgress);
              handleNext();
            }}
            handleHint={() => setHintIndex((prevIndex) => prevIndex + 1)}
          />
        </div>
      )}
    </>
  );
}
