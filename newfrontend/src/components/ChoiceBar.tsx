import { ReactNode } from "react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/solid";

export default function ChoiceBar(): ReactNode {
  return (
    <div className="grid grid-cols-2 gap-1 mt-1 w-full">
      <button className="btn btn-primary btn-lg flex justify-center items-center">
        <ArrowPathIcon className="w-6 h-6"/>
      </button>
      <button className="btn btn-primary btn-lg flex justify-center items-center">
        <CheckIcon className="w-6 h-6"/>
      </button>
    </div>
  );
}

