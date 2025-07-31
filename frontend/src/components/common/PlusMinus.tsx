import Button from './Button';
import { PlusIcon, MinusIcon } from './Icons';
import GuideHint from './GuideHint';

type PlusMinusProps = {
  onPlus: () => void;
  onMinus: () => void;
  helpVisibility?: boolean;
};

export default function PlusMinus({
  onPlus,
  onMinus,
  helpVisibility = false,
}: PlusMinusProps) {
  return (
    <>
      <Button onClick={onMinus} className="relative" aria-label="Snížit skore">
        <GuideHint
          visibility={helpVisibility}
          text="neznám"
          style={{
            left: '5px',
            bottom: '0px',
          }}
        />
        <MinusIcon />
      </Button>
      <Button onClick={onPlus} className="relative" aria-label="Zvýšit skore">
        <GuideHint
          visibility={helpVisibility}
          text="znám"
          style={{
            right: '5px',
            bottom: '0px',
          }}
        />
        <PlusIcon />
      </Button>
    </>
  );
}
