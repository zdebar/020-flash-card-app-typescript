import Button from './Button';
import { SlashBookmarkIcon } from './Icons';

interface SkipControlProps {
  handleSkip: () => void;
}

export default function SkipControl({ handleSkip }: SkipControlProps) {
  return (
    <Button onClick={handleSkip} color="secondary">
      <SlashBookmarkIcon></SlashBookmarkIcon>
    </Button>
  );
}
