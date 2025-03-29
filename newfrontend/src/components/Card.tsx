import Note from './Note';
import ChoiceBar from './ChoiceBar';

export default function Card() {
  return (
    <div className="flex w-[320px] flex-col items-center rounded-lg pb-4">
      <Note />
      <ChoiceBar />
    </div>
  );
}
