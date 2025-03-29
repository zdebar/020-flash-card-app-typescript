import { ReactNode } from 'react';
import { RefreshIcon, CheckIcon } from './Icons';

export default function ChoiceBar(): ReactNode {
  return (
    <div className="mt-1 grid w-full grid-cols-2 gap-1">
      <button className="btn btn-rec btn-gray">
        <RefreshIcon />
      </button>
      <button className="btn btn-rec btn-blue">
        <CheckIcon className="size-6" />
      </button>
    </div>
  );
}
