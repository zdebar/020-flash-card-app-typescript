import Button from './Button';
import { PracticeCardBar } from './PracticeCardBar';
import { InfoIcon } from './Icons';
import { Item } from '../../../../shared/types/dataTypes';
import { useUser } from '../../hooks/useUser';

interface TopBarProps {
  item: Item;
  setInfoVisibility: (value: boolean) => void;
}

export default function TopBar({ item, setInfoVisibility }: TopBarProps) {
  const { userScore } = useUser();

  return (
    <div className="button-rectangular flex gap-1">
      <div className="color-disabled shape-rectangular color-text flex h-full flex-1 items-center justify-center px-2 text-sm font-semibold">
        {userScore?.blockCount?.[0] || 0}
      </div>
      <PracticeCardBar blocks={userScore?.blockCount?.[0] || 0} />
      <Button // Info button
        onClick={() => setInfoVisibility(true)}
        disabled={!item?.has_info}
        buttonColor={
          item?.first_in_lecture && item?.progress === 0
            ? 'button-secondary'
            : 'button-primary'
        }
        className="shape-rectangular flex-1"
      >
        <InfoIcon></InfoIcon>
      </Button>
    </div>
  );
}
