import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/firebase.utils';
import config from '../config/config';
import Button from './common/Button';

interface PronunciationListBlock {
  id: number;
  block_name: string;
}

export default function PronunciationListCard() {
  const [pronunciationList, setPronunciationList] = useState<
    PronunciationListBlock[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPronunciationList = async () => {
      try {
        const response = await fetchWithAuth(
          `${config.Url}/api/pronunciation/list`
        );
        const { list } = await response.json();
        setPronunciationList(list);
      } catch (error) {
        console.error('Error fetching pronunciation list:', error);
      }
    };

    fetchPronunciationList();
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 py-4">
      {pronunciationList.map((block) => (
        <Button
          key={block.id}
          id={`button-${block.id}`}
          onClick={() => navigate(`/pronunciation/${block.id}`)}
        >
          {block.block_name}
        </Button>
      ))}
    </div>
  );
}
