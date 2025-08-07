import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { Item } from '../../../shared/types/dataTypes';
import DirectionDropdown from './common/DirectionDropdown';
import Button from './common/Button';
import config from '../config/config';
import CloseButton from './common/CloseButton';
import { useArray } from '../hooks/useArray';
import WordCard from './common/WordCard';
import Loading from './common/Loading';

export default function WordList() {
  const { languageID } = useUser();
  const { array, index, setIndex, arrayLength, loading } = useArray<Item>(
    `/api/items/${languageID}/list`,
    'GET'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [displayField, setDisplayField] = useState<'czech' | 'translation'>(
    'czech'
  );
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showExplanation, setShowExplanation] = useState(false);

  const currLanguage = config.languages.find((lang) => lang.id === languageID);

  if (!currLanguage) {
    throw new Error(`Language with ID ${languageID} not found in config.`);
  }

  // Filter items based on search term
  useEffect(() => {
    const filtered = array
      .filter((item) =>
        item[displayField]?.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const lengthDiff = a[displayField]?.length - b[displayField].length;
        if (lengthDiff !== 0) return lengthDiff;
        return a[displayField].localeCompare(b[displayField]);
      });
    setFilteredItems(filtered);
  }, [searchTerm, array, displayField]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const remainingCount = filteredItems.length - visibleCount;

  if (!arrayLength) return <Loading text="Žádná učená slovíčka!" />;
  if (loading) return <Loading />;

  return (
    <>
      {!showExplanation ? (
        <div className="w-card list z-1 h-full flex-1">
          <div className="h-A flex justify-between gap-1">
            {/* Toggle between czech and translation */}
            <DirectionDropdown
              value={displayField}
              options={[
                { value: 'czech', label: 'Čeština' },
                { value: 'translation', label: currLanguage.name },
              ]}
              onChange={(value) =>
                setDisplayField(value as 'czech' | 'translation')
              }
              className="w-full pt-1"
            />
            <CloseButton toLink="/userOverview" className="h-A w-A" />
          </div>
          {/* Search input */}
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Zadejte slovo..."
            className="h-A color-dropdown w-full px-10"
          />
          {/* Filtered items */}
          <div className="w-card list h-full overflow-y-auto">
            {visibleItems.map((item, idx) => (
              <Button
                key={idx}
                className="h-C flex justify-start px-2"
                onClick={() => {
                  setShowExplanation(true);
                  const selectedItem = filteredItems.find(
                    (filteredItem) => filteredItem.id === item.id
                  );
                  if (selectedItem) {
                    setIndex(array.indexOf(selectedItem));
                  }
                }}
              >
                <div className="h-C flex w-full flex-none items-center justify-between px-8 font-sans font-medium">
                  {displayField === 'czech' ? (
                    <>
                      <span>{item.czech}</span>
                      <span>{item.translation}</span>
                    </>
                  ) : (
                    <>
                      <span>{item.translation}</span>
                      <span>{item.czech}</span>
                    </>
                  )}
                </div>
              </Button>
            ))}
            {remainingCount > 0 && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="mt-2 w-full text-center hover:underline"
              >
                ... a {remainingCount} další
              </button>
            )}
          </div>
        </div>
      ) : (
        <WordCard
          item={array[index]}
          setVisibility={setShowExplanation}
          canReset={true}
        />
      )}
    </>
  );
}
