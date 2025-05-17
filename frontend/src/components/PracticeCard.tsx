import { useEffect, useState, useRef } from 'react';
import PracticeControls from './common/PracticeControls';
import config from '../config/config';
import Card from './common/Card';
import { useAudioManager } from '../hooks/useAudioManager';
import { useItemArray } from '../hooks/useItemArray';

import InfoCard from './InfoCard';

import TopBar from './common/TopBar';

export default function PracticeCard() {
  const { itemArray, currentIndex, direction, updateItemArray } =
    useItemArray();
  const { playAudio, setVolume } = useAudioManager(itemArray);
  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null); // je toto vůbez potřeba?
  const [error, setError] = useState<string | null>(null); // jak více obecně chybové hlášky?

  useEffect(() => {
    const audio = itemArray?.[currentIndex]?.audio || null;
    setCurrentAudio(audio);
  }, [itemArray, currentIndex]);

  // Set error when no audio is available
  useEffect(() => {
    if (!currentAudio) {
      setError('noAudio');
    } else {
      setError(null);
    }
  }, [currentAudio]);

  // Play audio when en to cz card direction is started
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!direction && currentAudio) {
      setTimeout(() => playAudio(currentAudio), 100);
    }
  }, [direction, playAudio, currentAudio]);

  // Handler to reveal button
  function handleReveal() {
    setRevealed(true);
    if (direction) playAudio(currentAudio);
    setHintIndex(0);
  }

  if (itemArray?.length === 0) {
    return <p>Loading..</p>;
  }

  return (
    <>
      {infoVisibility ? (
        <InfoCard
          itemId={itemArray[currentIndex]?.id}
          setVisibility={setInfoVisibility}
        />
      ) : (
        <div className="card">
          <TopBar
            itemArray={itemArray}
            currentIndex={currentIndex}
            setInfoVisibility={setInfoVisibility}
          />
          <Card
            item={itemArray[currentIndex]}
            index={currentIndex}
            total={itemArray.length}
            direction={direction}
            revealed={revealed}
            hintIndex={hintIndex}
            setVolume={setVolume}
            error={error}
          ></Card>
          <PracticeControls
            revealed={revealed}
            direction={direction}
            noAudio={!currentAudio}
            handleAudio={() => playAudio(currentAudio)}
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
