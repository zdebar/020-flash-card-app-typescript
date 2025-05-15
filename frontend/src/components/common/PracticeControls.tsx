import {
  AudioIcon,
  MicrophoneIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  HintIcon,
} from './Icons';
import Button from './Button';
import { useMemo } from 'react';

interface PracticeControlsProps {
  revealed: boolean;
  direction: boolean;
  noAudio: boolean;
  handleAudio: () => void;
  handleReveal: () => void;
  handlePlus: () => void;
  handleMinus: () => void;
  handleHint: () => void;
}

export default function PracticeControls({
  revealed,
  direction,
  noAudio,
  handleAudio,
  handleReveal,
  handlePlus,
  handleMinus,
  handleHint,
}: PracticeControlsProps) {
  const isAudioDisabled = useMemo(() => {
    return (direction && !revealed) || noAudio;
  }, [direction, revealed, noAudio]);

  return (
    <div className="flex w-full justify-between gap-1">
      <div className="flex w-full flex-col gap-1">
        <Button
          onClick={handleAudio}
          disabled={isAudioDisabled}
          className="button-rectangular"
        >
          <AudioIcon></AudioIcon>
        </Button>
        <Button disabled={true} className="button-rectangular">
          <MicrophoneIcon></MicrophoneIcon>
        </Button>
      </div>
      {!revealed ? (
        <div className="flex w-full flex-col gap-1">
          <Button onClick={handleReveal} className="button-rectangular">
            <EyeIcon></EyeIcon>
          </Button>
          <Button onClick={handleHint} className="button-rectangular">
            <HintIcon></HintIcon>
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1">
          <Button onClick={handlePlus} className="button-rectangular">
            <PlusIcon></PlusIcon>
          </Button>
          <Button onClick={handleMinus} className="button-rectangular">
            <MinusIcon></MinusIcon>
          </Button>
        </div>
      )}
    </div>
  );
}
