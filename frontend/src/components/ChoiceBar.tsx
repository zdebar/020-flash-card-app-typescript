import { ReactNode } from "react";
import { IconRepeat, IconKnown } from "./Icons/Icon";

export default function ChoiceBar(): ReactNode {
  return (
    <div className="choiceBar grid-2 gap-1 mt-1">
      <button className="flex justify-center align-center border-left-bottom h-10">
        <IconRepeat style={{ width: "20px", fill: "var(--text-color)" }} />
      </button>
      <button className="flex justify-center align-center border-right-bottom h-10">
        <IconKnown style={{ width: "20px", fill: "var(--text-color)" }} />
      </button>
    </div>
  );
}