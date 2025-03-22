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
      <div className="flex flex-col justify-between border-t p-4">
        <div className="flex flex-col justify-between items-center"></div>
      </div>
    );
  }

  return (
    <button onClick={onClick} className="flex flex-col justify-between items-center border-t p-4 bg-base-100 hover:bg-base-200 rounded-md">
      <p className="text-xl font-semibold">{words[0].src}</p>
      {showTranslations && (
        <div className="text-sm">
          <p>{words[0].trg}</p>
          <p className="italic">{words[0].prn}</p>
        </div>
      )}
    </button>
  );
}
