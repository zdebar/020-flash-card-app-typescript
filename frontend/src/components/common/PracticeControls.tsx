import Button from './Button';
import {
  AudioIcon,
  MicrophoneIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  HintIcon,
} from './Icons';

interface PracticeControlsProps {
  revealed: boolean;
  direction: boolean;
  handleAudio: () => void;
  handleReveal: () => void;
  handlePlus: () => void;
  handleMinus: () => void;
  handleHint: () => void;
}

export default function PracticeControls({
  revealed,
  direction,
  handleAudio,
  handleReveal,
  handlePlus,
  handleMinus,
  handleHint,
}: PracticeControlsProps) {
  return (
    <div className="flex w-full justify-between gap-1">
      <div className="flex w-full flex-col gap-1">
        <Button onClick={handleAudio} isActive={!direction || revealed}>
          <AudioIcon></AudioIcon>
        </Button>
        <Button>
          <MicrophoneIcon></MicrophoneIcon>
        </Button>
      </div>
      {!revealed ? (
        <div className="flex w-full flex-col gap-1">
          <Button onClick={handleReveal}>
            <EyeIcon></EyeIcon>
          </Button>
          <Button onClick={handleHint}>
            <HintIcon></HintIcon>
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1">
          <Button onClick={handlePlus} isActive={revealed}>
            <PlusIcon></PlusIcon>
          </Button>
          <Button onClick={handleMinus} isActive={revealed}>
            <MinusIcon></MinusIcon>
          </Button>
        </div>
      )}
    </div>
  );
}
