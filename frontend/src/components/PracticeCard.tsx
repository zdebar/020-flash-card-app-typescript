import { useEffect, useState } from 'react';

import PracticeControls from './common/PracticeControls';
import { Item } from '../../../shared/types/dataTypes';
import config from '../config/config';
import SkipControl from './common/SkipControl';
import Card from './common/Card';
import { useHint } from '../hooks/useHint';
import { useAudioManager } from '../hooks/useAudioManager';
import { useWordArray } from '../hooks/useWordArray';

const PATH = `${config.Url}/api/words`;

export default function PracticeCard({ inArray: words }: { inArray: Item[] }) {
  const { wordArray, setWordArray, currentIndex, direction, updateWordArray } =
    useWordArray(PATH);
  const { hintIndex, handleHint, resetHint } = useHint();
  const { playAudio } = useAudioManager(wordArray);
  const [revealed, setRevealed] = useState(false);

  const currentAudio = wordArray[currentIndex]?.audio || null;

  // Fetch words from the server when the component mounts
  useEffect(() => {
    const fetchWords = async () => {
      setWordArray(words);
    };

    fetchWords();
  }, [words, setWordArray]);

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
