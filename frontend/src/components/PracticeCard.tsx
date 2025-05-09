import { useEffect, useState } from 'react';
import PracticeControls from './common/PracticeControls';
import config from '../config/config';
import Card from './common/Card';
import { useAudioManager } from '../hooks/useAudioManager';
import { useItemArray } from '../hooks/useItemArray';
import Button from './common/Button';
import { InfoIcon, SlashBookmarkIcon } from './common/Icons';
import InfoCard from './InfoCard';

export default function PracticeCard() {
  const { itemArray, currentIndex, direction, updateItemArray } =
    useItemArray();
  const { playAudio } = useAudioManager(itemArray);
  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);

  const currentAudio = itemArray?.[currentIndex]?.audio || null;

  // Play audio when en to cz card direction is started
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
    <div>
      {infoVisibility ? (
        <InfoCard
          itemId={itemArray[currentIndex]?.id}
          setInfo={setInfoVisibility}
        />
      ) : (
        <div className="card">
          <div className="flex w-full gap-1">
            <Button
              onClick={() => setInfoVisibility(true)}
              buttonColor="button-secondary"
              disabled={!itemArray[currentIndex]?.has_info}
              className="flex-10"
            >
              <InfoIcon></InfoIcon>
            </Button>
            <Button
              onClick={() => updateItemArray(0, true)}
              buttonColor="button-secondary"
              className="flex-2"
            >
              <SlashBookmarkIcon></SlashBookmarkIcon>
            </Button>
          </div>
          <Card
            currentIndex={currentIndex}
            wordArray={itemArray}
            direction={direction}
            revealed={revealed}
            hintIndex={hintIndex}
          ></Card>
          <PracticeControls
            revealed={revealed}
            direction={direction}
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
    </div>
  );
}
