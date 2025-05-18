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

  const [error, setError] = useState<PracticeError | null>(null);

  useEffect(() => {
    if (!currentItem?.audio) {
      setError(PracticeError.NoAudio);
    } else {
      setError(null);
    }
  }, [currentItem]);

  useAutoPlayAudioOnDirection(direction, playAudio, currentItem?.audio);

  // Handler to reveal button
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
