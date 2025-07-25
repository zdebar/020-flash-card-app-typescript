// import ButtonLink from './common/ButtonLink.js';
// import Button from './common/Button.js';
import { useArray } from '../hooks/useArray';
import { useUser } from '../hooks/useUser';
import { Item } from '../../../shared/types/dataTypes';
import { useState, useEffect } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';

export default function WordList() {
  const apiPath = '/api/items/all';
  const { languageID } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { array, index, nextIndex, arrayLength, setReload, currentItem } =
    useArray<Item>(apiPath, String(languageID), 'GET');

  // Filter items based on search term
  useEffect(() => {
    setFilteredItems(
      array.filter((item) =>
        item.czech.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, array]);

  const handleReset = async () => {
    if (!selectedItem) return;

    try {
      await fetchWithAuthAndParse<void>(`/api/items/${selectedItem.id}/reset`, {
        method: 'POST',
      });
      alert(
        `Item "${selectedItem.czech + ' | ' + selectedItem.translation}" has been reset.`
      );
    } catch (error) {
      console.error('Error resetting item:', selectedItem.id, error);
    }
  };

  return (
    <div className="card">
      <p>Ahoj</p>
    </div>
  );
}
