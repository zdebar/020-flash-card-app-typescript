import { ReactNode } from "react";
import Icon, { IconRepeat, IconKnown } from "./Icons/Icon";
import "./ChoiceBar.css";

export default function ChoiceBar(): ReactNode {
  return (
    <div className="choiceBar grid">
      <button className="repeatButton flex justify-center align-center border">
        <Icon IconImage={IconRepeat} style={{ width: "20px", fill: "var(--text-color)" }} />
      </button>
      <button className="knownButton flex justify-center align-center border">
        <Icon IconImage={IconKnown} style={{ width: "20px", fill: "var(--text-color)" }} />
      </button>
    </div>
  );
}