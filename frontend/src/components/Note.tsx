import './Note.css';

interface Word {
  src: string;
  trg: string;
  prn: string;
}

interface NoteProps {
  words: Word[];
  showTranslations: boolean;
  onClick: () => void;
}

export default function Note({ words = [], showTranslations, onClick }: NoteProps) {
  if (!words || words.length === 0) {
    return (
      <div className="note flex-column justify-between">
        <div className="flex-column justify-between align-center border-top"></div>
      </div>
    );
  }

  return (
    <button onClick={onClick} className="note flex-column justify-between align-center border-top">
      <p className="src flex-column justify-evenly">{words[0].src}</p>
        {showTranslations && (
        <div className='trg flex-column justify-evenly'>
          <p>{words[0].trg}</p>
          <p>{words[0].prn}</p>
        </div>
      )}
    </button>
  );
}
