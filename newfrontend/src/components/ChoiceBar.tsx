import { ReactNode } from "react";
import { RefreshIcon, CheckIcon } from "./Icons";

export default function ChoiceBar(): ReactNode {
  return (
    <div className="grid grid-cols-2 gap-1 mt-1 w-full">
      <button className="flex justify-center items-center py-2 px-4 bg-gray-100 rounded-lg shadow-md active:shadow-none hover:bg-gray-200">
        <RefreshIcon />
      </button>
      <button className="flex justify-center items-center py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md active:shadow-none hover:bg-blue-800">
        <CheckIcon className="w-6 h-6" />
      </button>
    </div>
  );
}

