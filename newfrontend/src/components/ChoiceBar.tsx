import { ReactNode } from 'react';
import { RefreshIcon, CheckIcon } from './Icons';

export default function ChoiceBar(): ReactNode {
  return (
    <div className="mt-1 grid w-full grid-cols-2 gap-1">
      <button className="btn-gray">
        <RefreshIcon />
      </button>
      <button className="btn-blue">
        <CheckIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
