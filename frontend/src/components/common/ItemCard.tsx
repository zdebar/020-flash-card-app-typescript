import { useState } from 'react';
import { fetchWithAuthAndParse } from '../../utils/auth.utils';
import { convertToItemProgress } from '../../utils/practice.utils';
import { UserScore, Item } from '../../../../shared/types/dataTypes';
import Button from './Button';

interface ItemProps {
  item: Item;
  onClose: () => void;
}

export function ItemCard({ item, onClose }: ItemProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    const updatedItem = {
      ...item,
      progress: 0,
      skipped: false,
    };

    try {
      setIsResetting(true);
      const response = await fetchWithAuthAndParse<{
        score: UserScore | null;
      }>('/api/items', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertToItemProgress([updatedItem])),
      });

      if (!response) {
        throw new Error('Failed to reset item');
      }
    } catch (error) {
      console.error('Error resetting item:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="card color-disabled gap-1 border p-2">
      <div className="grid h-full grid-cols-2 gap-0">
        <p className="text-left font-bold">ID:</p>
        <p>{item.id}</p>

        <p className="text-left font-bold">Česky:</p>
        <p>{item.czech}</p>

        <p className="text-left font-bold">Anglicky:</p>
        <p>{item.english}</p>

        <p className="text-left font-bold">Výslovnost:</p>
        <p>{item.pronunciation || 'N/A'}</p>

        <p className="text-left font-bold">Audio:</p>
        <p>{item.audio || 'N/A'}</p>

        <p className="text-left font-bold">Pořadí:</p>
        <p>{item.item_order}</p>

        <p className="text-left font-bold">Pokrok:</p>
        <p>{item.progress}</p>

        <p className="text-left font-bold">Přeskočeno:</p>
        <p>{item.skipped ? 'Ano' : 'Ne'}</p>

        <p className="text-left font-bold">Příště:</p>
        <p>{item.next_at ? new Date(item.next_at).toLocaleString() : 'Ne'}</p>

        <p className="text-left font-bold">Naučeno:</p>
        <p>
          {item.mastered_at
            ? new Date(item.mastered_at).toLocaleString()
            : 'Ne'}
        </p>
      </div>

      <div className="flex gap-1">
        <Button onClick={onClose} buttonColor="button-secondary">
          Back
        </Button>
        <Button onClick={handleReset} disabled={isResetting}>
          {isResetting ? 'Resetting...' : 'Reset'}
        </Button>
      </div>
    </div>
  );
}
