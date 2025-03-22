import { ReactNode, useState } from 'react';
import ChoiceBar from './ChoiceBar';
import Note from './Note';


interface Word {
  src: string;
  trg: string;
  prn: string;
}

interface CardProps {
  words: Word[];
}

export default function Card({ words = [] }: CardProps): ReactNode {
  const [showTranslations, setShowTranslations] = useState<boolean>(false);

  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col justify-between p-4 border rounded-lg shadow-md">
        <div className="flex flex-col justify-between items-center"></div>
      </div>
    );
  }

  const handleReveal = (): void => {
    setShowTranslations(true);
  };

  return (
    <div className="flex flex-col justify-between p-4 border rounded-lg shadow-md">
      <Note words={words} showTranslations={showTranslations} onClick={handleReveal} />
      {showTranslations && <ChoiceBar />}
    </div>
  );
}
