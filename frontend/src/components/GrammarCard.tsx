import { useEffect } from 'react';
import { Lecture } from '../../../shared/types/dataTypes';
import config from '../config/config';
import getData from '../utils/getData';

const PATH = `${config.Url}/api/words`;

export default function GrammarCard() {
  // Fetch words from the server when the component mounts
  useEffect(() => {
    const fetchWords = async () => {
      const { grammar }: { grammar: Lecture } = await getData(PATH);
      setWordArray(grammar.items);
    };

    fetchWords();
  }, [setWordArray]);

  return <p>Details about the card will go here.</p>;
}
