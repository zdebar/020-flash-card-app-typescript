import "./ChoiceBar.css";
import IconRepeat from './Icons/IconRepeat';
import IconKnown from "./Icons/IconKnown";

export default function ChoiceBar() {
  return (
    <div className="choiceBar grid">
      <button className="repeatButton flex justify-center align-center border">
        <IconRepeat style={{ fill: "var(--text-color)"}}/>
      </button>
      <button className="knownButton flex justify-center align-center border">
        <IconKnown style={{ fill: "var(--text-color)"}}/>
      </button>
    </div>
  );
}