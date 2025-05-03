import { useEffect, useState } from 'react';

import PracticeControls from './common/PracticeControls';

import config from '../config/config';
import SkipControl from './common/SkipControl';
import Card from './common/Card';
import { useHint } from '../hooks/useHint';
import { useAudioManager } from '../hooks/useAudioManager';
import { useWordArray } from '../hooks/useWordArray';

export default function PracticeCard() {
  const { wordArray, currentIndex, direction, updateWordArray } = useWordArray(
    `${config.Url}/api/words`,
    `${config.Url}/api/words`
  );
  const { hintIndex, handleHint, resetHint } = useHint();
  const { playAudio } = useAudioManager(wordArray);
  const [revealed, setRevealed] = useState(false);

  const currentAudio = wordArray[currentIndex]?.audio || null;

  useEffect(() => {
    if (!direction && currentAudio) {
      setTimeout(() => playAudio(currentAudio), 100);
    }
  }, [direction, playAudio, currentAudio]);

  function handleReveal() {
    setRevealed(true);
    if (direction) playAudio(currentAudio);
    resetHint();
  }

  if (wordArray.length === 0) {
    return <p>Loading..</p>;
  }

  return (
    <div className="flex w-[320px] flex-col justify-center py-4">
      <div className="flex flex-col gap-1">
        <SkipControl handleSkip={() => updateWordArray(0, true)} />
        <Card
          currentIndex={currentIndex}
          wordArray={wordArray}
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
            updateWordArray(config.plusProgress);
            setRevealed(false);
          }}
          handleMinus={() => {
            updateWordArray(config.minusProgress);
            setRevealed(false);
          }}
          handleHint={() => handleHint()}
        />
      </div>
    </div>
  );
}
