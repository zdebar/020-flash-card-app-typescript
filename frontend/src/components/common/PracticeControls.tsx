import {
  AudioIcon,
  MicrophoneIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  HintIcon,
} from './Icons';
import Button from './Button';

interface PracticeControlsProps {
  revealed: boolean;
  direction: boolean;
  noAudio: boolean;
  handleAudio: () => void;
  handleReveal: () => void;
  handlePlus: () => void;
  handleMinus: () => void;
  handleHint: () => void;
  startRecording?: () => void;
  stopRecording?: () => void;
  isAudioChecking?: boolean;
  isRecording?: boolean;
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
  startRecording,
  stopRecording,
  isAudioChecking = false,
  isRecording = false,
}: PracticeControlsProps) {
  const isAudioDisabled = (direction && !revealed) || noAudio;

  return (
    <div className="flex w-full justify-between gap-1">
      <div className="flex w-full flex-col gap-1">
        <Button
          onClick={handleAudio}
          disabled={isAudioDisabled}
          className="button-rectangular"
          aria-label="Přehrát audio"
        >
          <AudioIcon></AudioIcon>
        </Button>
        <Button
          disabled={isAudioChecking}
          className="button-rectangular"
          aria-label="Mikrofon (zatím nedostupné)"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          buttonColor={isRecording ? 'button-tertiary' : 'button-primary'}
        >
          <MicrophoneIcon></MicrophoneIcon>
        </Button>
      </div>
      {!revealed ? (
        <div className="flex w-full flex-col gap-1">
          <Button
            onClick={handleReveal}
            className="button-rectangular"
            aria-label="Zobrazit odpověď"
          >
            <EyeIcon></EyeIcon>
          </Button>
          <Button
            onClick={handleHint}
            className="button-rectangular"
            aria-label="Nápověda"
          >
            <HintIcon></HintIcon>
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1">
          <Button
            onClick={handlePlus}
            className="button-rectangular button-secondary"
            aria-label="Zvýšit skore"
          >
            <PlusIcon></PlusIcon>
          </Button>
          <Button
            onClick={handleMinus}
            className="button-rectangular button-secondary"
            aria-label="Snížit skore"
          >
            <MinusIcon></MinusIcon>
          </Button>
        </div>
      )}
    </div>
  );
}
