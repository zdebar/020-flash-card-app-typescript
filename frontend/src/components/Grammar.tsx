import { useOverview } from '../hooks/useOverview';
import { Block } from '../../../shared/types/dataTypes';
import Button from './common/Button';

export default function Grammar() {
  const { overviewArray } = useOverview<Block>('/api/overview/grammar');

  return (
    <div className="flex w-[320px] flex-col justify-between gap-0.5">
      {overviewArray.map((item) => (
        <Button
          key={item.block_id}
          buttonColor="button-secondary h-6 shadow-none justify-start pl-4"
        >
          {item.block_order + '  ' + item.block_name}
        </Button>
      ))}
    </div>
  );
}
