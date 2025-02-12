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

  // ToDo - change to empty card or no card
  if (!words || words.length === 0) {
    return (
      <div className="card flex-column justify-between">
        <div className="flex-column justify-between align-center border-top"></div>
      </div>
    );
  }

  const handleReveal = (): void => {
    console.log("Reveal button clicked");
    setShowTranslations(true); // Show translations when the Reveal button is clicked
  };

  return (
    <div className="card flex-column justify-between">
      <div className="flex-column justify-between align-center border-top">
        <p className="src flex-column justify-center h-10">src</p>
        {!showTranslations ? (
          <div className='trg flex-column justify-evenly'>
          <p></p>
          <p></p>
        </div>
        ) : (
          <div className='trg flex-column justify-evenly'>
          <p>trg</p>
          <p>prn</p>
          </div>
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
