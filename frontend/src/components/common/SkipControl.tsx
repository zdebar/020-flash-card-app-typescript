import { SlashBookmarkIcon } from './Icons';
import Button from './Button';

interface SkipControlProps {
  className?: string;
  handleSkip: () => void;
}

export default function SkipControl({
  className,
  handleSkip,
}: SkipControlProps) {
  return (
    <Button
      onClick={handleSkip}
      buttonColor="button-secondary"
      className={className}
    >
      <SlashBookmarkIcon></SlashBookmarkIcon>
    </Button>
  );
}
