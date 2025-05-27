import Button from './Button';
import { PracticeCardBar } from './PracticeCardBar';
import { InfoIcon } from './Icons';
import { Item } from '../../../../shared/types/dataTypes';
import { useUser } from '../../hooks/useUser';

interface TopBarProps {
  item: Item;
  revelead: boolean;
  setInfoVisibility: (value: boolean) => void;
}

export default function TopBar({
  item,
  revelead,
  setInfoVisibility,
}: TopBarProps) {
  const { userScore } = useUser();
  const blockCount = userScore?.blockCount?.[0] || 0;
  const infoButtonColor =
    item?.progress === 0 ? 'button-secondary' : 'button-primary';

  return (
    <div className="flex min-h-12 gap-1">
      <div className="color-disabled shape-rectangular color-text flex items-center justify-center px-2 text-sm font-semibold">
        {blockCount}
      </div>
      <PracticeCardBar blocks={blockCount} />
      <Button
        onClick={() => setInfoVisibility(true)}
        disabled={!item?.has_info || !revelead}
        buttonColor={infoButtonColor}
        className="shape-rectangular"
        aria-label="Zobrazit informace"
      >
        <InfoIcon />
      </Button>
    </div>
  );
}
