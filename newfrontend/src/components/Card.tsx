import { RefreshIcon, CheckIcon } from './Icons';

export default function Card() {
  return (
    <div className="w-[320px]">
      <button className="btn-gray flex h-[120px] w-full flex-col items-center justify-evenly rounded-t-md py-4">
        <p className="font-bold">src</p>
        <p>trg</p>
        <p>prn</p>
      </button>
      <div className="my-1 grid w-full grid-cols-2 gap-1">
        <button className="btn btn-rec btn-gray rounded-bl-md">
          <RefreshIcon className="size-5" />
        </button>
        <button className="btn btn-rec btn-blue rounded-br-md">
          <CheckIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
