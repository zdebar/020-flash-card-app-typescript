import Note from './Note';
import ChoiceBar from './ChoiceBar';

export default function Card() {
  return (
    <div className="flex flex-col items-center rounded-lg w-[320px]">
      <Note />
      <ChoiceBar />
    </div>
  );
}
