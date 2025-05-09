import { useOverview } from '../hooks/useOverview';
import { ItemFull } from '../../../shared/types/dataTypes';
import Button from './common/Button';

export default function Vocabulary() {
  const { overviewArray } = useOverview<ItemFull>('/api/overview/vocabulary');

  return (
    <div className="flex w-[320px] flex-col justify-between gap-0.5">
      {overviewArray.map((item) => (
        <Button
          key={item.id}
          buttonColor="button-secondary h-6 shadow-none justify-start pl-4"
        >
          {item.id + '  ' + item.english + '  ' + item.progress}
        </Button>
      ))}
    </div>
  );
}
