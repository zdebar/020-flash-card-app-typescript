import { useState } from 'react';
import './Card.css';
import ChoiceBar from './ChoiceBar';
import RevealButton from './RevealButton';
import PropTypes from 'prop-types';

export default function Card({ words = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslations, setShowTranslations] = useState(false);

  if (!words || words.length === 0) {
    return (
      <div className="card flex-column justify-between">
        <div className="note flex-column justify-between align-center border"></div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const handleReveal = () => {
    console.log("Reveal button clicked");
    setShowTranslations(true); // Show translations when the button is clicked
  };
  
  const handleNextWord = () => {
    console.log("Moving to the next word");
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1); // Move to the next word
      setShowTranslations(false); // Reset translations visibility for the next word
    }
  };

  return (
    <div className="card flex-column justify-between">
      <div className="note flex-column justify-between align-center border">
        <p className="text__src flex-column justify-center">{currentWord.src || ''}</p>
        {showTranslations && (
          <>
            <p className="text__trg flex-column justify-center">{currentWord.trg || ''}</p>
            <p className="text__prn flex-column justify-center">[ {currentWord.prn || ''} ]</p>
          </>
        )}
      </div>

      {!showTranslations ? (
        <RevealButton onClick={handleReveal} />
      ) : (
        <ChoiceBar onChoiceSelected={handleNextWord} />
      )}

    </div>
  );
}

Card.propTypes = {
  words: PropTypes.array.isRequired,
};
