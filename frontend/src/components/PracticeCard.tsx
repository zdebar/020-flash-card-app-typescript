import { useEffect, useState, useRef } from 'react';
import PracticeControls from './common/PracticeControls';
import config from '../config/config';
import Card from './common/Card';
import { useAudioManager } from '../hooks/useAudioManager';
import { useItemArray } from '../hooks/useItemArray';

import InfoCard from './InfoCard';

import TopBar from './common/TopBar';

export default function PracticeCard() {
  const {
    itemArray,
    currentItem,
    index,
    direction,
    itemArrayLength,
    updateItemArray,
  } = useItemArray();
  const { playAudio, setVolume } = useAudioManager(itemArray);

  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);

  const [error, setError] = useState<string | null>(null); // jak více obecně chybové hlášky?

  useEffect(() => {
    if (!currentItem?.audio) {
      setError('noAudio');
    } else {
      setError(null);
    }
  }, [currentItem]);

  // Play audio when en to cz card direction is started
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!direction && currentItem?.audio) {
      setTimeout(() => playAudio(currentItem.audio), 100);
    }
  }, [direction, playAudio, currentItem]);

  // Handler to reveal button
  function handleReveal() {
    setRevealed(true);
    if (direction && currentItem?.audio) playAudio(currentItem.audio);
    setHintIndex(0);
  }

  if (!itemArrayLength) return <p>Loading..</p>;

  return (
    <>
      {infoVisibility ? (
        <InfoCard itemId={currentItem?.id} setVisibility={setInfoVisibility} />
      ) : (
        <div className="card">
          <TopBar item={currentItem} setInfoVisibility={setInfoVisibility} />
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
              setRevealed(false);
            }}
            handleMinus={() => {
              updateItemArray(config.minusProgress);
              setRevealed(false);
            }}
            handleHint={() => setHintIndex((prevIndex) => prevIndex + 1)}
          />
        </div>
      )}
    </>
  );
}
