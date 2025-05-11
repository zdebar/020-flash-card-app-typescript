import { useList } from '../hooks/useList';
import { Item } from '../../../shared/types/dataTypes';
import Button from './common/Button';
import { ListItem } from './common/ListItem';
import { useState } from 'react';
import { ItemCard } from './common/ItemCard';

export function Words() {
  const { containerRef, listArray, fetchPage, currentPage, totalPages } =
    useList<Item>('/api/items/words', () => 10);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  return (
    <>
      {showItemDetails && selectedItem ? (
        <ItemCard
          item={selectedItem}
          onClose={() => setShowItemDetails(false)}
        />
      ) : (
        <div className="flex h-full w-full flex-col">
          <div ref={containerRef} className="flex h-full w-full flex-col gap-1">
            {listArray.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
          <div className="flex h-20 items-center justify-center p-4">
            <Button
              onClick={() => fetchPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-4 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => fetchPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
