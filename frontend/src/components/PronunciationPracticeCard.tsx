import { PronunciationWord } from '../../../shared/types/dataTypes';
import Button from './common/Button';

export default function PronunciationPracticeCard({
  group,
}: {
  group: PronunciationWord[];
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 py-4">
      {group.map((word, index) => (
        <Button color="secondary" key={index}>
          {word.english}
        </Button>
      ))}
    </div>
  );
}
