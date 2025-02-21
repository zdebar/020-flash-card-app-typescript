import { ReactNode, useState } from 'react';
import './Card.css';
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
      <div className="card flex-column justify-between">
        <div className="flex-column justify-between align-center border-top"></div>
      </div>
    );
  }

  const handleReveal = (): void => {
    setShowTranslations(true);
  };

  return (
    <div  className="card flex-column justify-between">
      <Note words={words} showTranslations={showTranslations} onClick={handleReveal} />
      {showTranslations && <ChoiceBar />}
    </div>
  );
}