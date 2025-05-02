import { useEffect } from 'react';
import { fetchWithAuth } from '../utils/firebase.utils';
import config from '../config/config';

export default function GrammarCard() {
  useEffect(() => {
    const fetchPronunciationList = async () => {
      try {
        const response = await fetchWithAuth(`${config.Url}/api/grammar`);
        const { grammar } = await response.json();
        console.log('Grammar List:', grammar);
      } catch (error) {
        console.error('Error fetching pronunciation list:', error);
      }
    };

    fetchPronunciationList();
  }, []);

  return <p>Details about the card will go here.</p>;
}
