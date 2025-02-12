import { ReactNode, useState } from 'react';
import './Card.css';
import ChoiceBar from './ChoiceBar';
import RevealButton from './RevealButton';

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
        <div className="note flex-column justify-between align-center border"></div>
      </div>
    );
  }

  const handleReveal = (): void => {
    console.log("Reveal button clicked");
    setShowTranslations(true); // Show translations when the button is clicked
  };

  return (
    <div className="card flex-column justify-between">
      <div className="note flex-column justify-between align-center border">
        <p className="text__src flex-column justify-center">src</p>
        {showTranslations && (
          <>
            <p className="text__trg flex-column justify-center">trg</p>
            <p className="text__prn flex-column justify-center">prn</p>
          </>
        )}
      </div>

      {!showTranslations ? (
        <RevealButton onClick={handleReveal} />
      ) : (
        <ChoiceBar />
      )}
    </div>
  );
}
