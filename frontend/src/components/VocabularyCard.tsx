import { useEffect, useState } from 'react';
import { Item } from '../../../shared/types/dataTypes';
import config from '../config/config';
import PracticeCard from './PracticeCard';
import getData from '../utils/getData';

const PATH = `${config.Url}/api/words`;

export default function VocabularyCard() {
  const [words, setWords] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await getData<{ words: Item[] }>(
          `${PATH}?type=vocabulary`
        );
        setWords(data.words);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchWords();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return <PracticeCard words={words} />;
}
