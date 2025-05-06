import { SlashBookmarkIcon } from './Icons';
import Button from './Button';

interface SkipControlProps {
  handleSkip: () => void;
}

export default function SkipControl({ handleSkip }: SkipControlProps) {
  return (
    <Button onClick={handleSkip} buttonColor="button-secondary">
      <SlashBookmarkIcon></SlashBookmarkIcon>
    </Button>
  );
}
