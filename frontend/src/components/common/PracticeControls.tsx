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
  audioIsPlaying: boolean;
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
  audioIsPlaying,
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
        <Button onClick={handleAudio} disabled={isAudioDisabled}>
          <AudioIcon></AudioIcon>
        </Button>
        <Button disabled={audioIsPlaying}>
          <MicrophoneIcon></MicrophoneIcon>
        </Button>
      </div>
      {!revealed ? (
        <div className="flex w-full flex-col gap-1">
          <Button onClick={handleReveal} disabled={audioIsPlaying}>
            <EyeIcon></EyeIcon>
          </Button>
          <Button onClick={handleHint} disabled={audioIsPlaying}>
            <HintIcon></HintIcon>
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1">
          <Button onClick={handlePlus} disabled={audioIsPlaying}>
            <PlusIcon></PlusIcon>
          </Button>
          <Button onClick={handleMinus} disabled={audioIsPlaying}>
            <MinusIcon></MinusIcon>
          </Button>
        </div>
      )}
    </div>
  );
}
