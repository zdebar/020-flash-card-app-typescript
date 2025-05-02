import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/firebase.utils';
import config from '../config/config';
import { PronunciationWord } from '../../../shared/types/dataTypes';
import ExplanationCard from './ExplanationCard';
import PronunciationPracticeCard from './PronunciationPracticeCard';

export default function PronunciationCard() {
  const { id } = useParams<{ id: string }>();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [wordArray, setWordArray] = useState<PronunciationWord[][]>([]);
  const [currentStep, setCurrentStep] = useState<'explanation' | 'practice'>(
    'explanation'
  );
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  useEffect(() => {
    const fetchPronunciationList = async () => {
      try {
        const response = await fetchWithAuth(
          `${config.Url}/api/pronunciation/${id}`
        );
        const { pronunciation } = await response.json();

        if (!pronunciation) {
          console.error('Pronunciation not found');
          return;
        }
        setExplanation(pronunciation.block_explanation);
        setWordArray(pronunciation.items);
      } catch (error) {
        console.error('Error fetching pronunciation list:', error);
      }
    };

    fetchPronunciationList();
  }, [id]);

  const handleNext = () => {
    setCurrentStep('practice');
  };

  const handleNextGroup = () => {
    setCurrentGroupIndex((prevIndex) => prevIndex + 1);
  };

  if (currentStep === 'explanation' && explanation) {
    return <ExplanationCard explanation={explanation} onNext={handleNext} />;
  }

  if (currentStep === 'practice' && wordArray.length > 0) {
    return (
      <PronunciationPracticeCard group={wordArray[currentGroupIndex] || []} />
    );
  }

  return <p>Loading...</p>;
}
