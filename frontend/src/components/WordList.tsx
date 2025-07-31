import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { Item } from '../../../shared/types/dataTypes';
import DirectionDropdown from './common/DirectionDropdown';
import ButtonReset from './common/ButtonReset';
import config from '../config/config';
import Loading from './common/Loading';
import CloseButton from './common/CloseButton';

export default function WordSearch() {
  const { languageID, userScore } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayField, setDisplayField] = useState<'czech' | 'translation'>(
    'czech'
  );
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // State to track how many items are visible
  const currLanguage = config.languages.find((lang) => lang.id === languageID);

  if (!currLanguage) {
    throw new Error(`Language with ID ${languageID} not found in config.`);
  }

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetchWithAuthAndParse<{ data: Item[] }>(
          `/api/items/${languageID}/list`,
          { method: 'GET' }
        );
        setItems(response?.data ?? []);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchItems();
  }, [languageID, userScore]);

  // Filter items based on search term
  useEffect(() => {
    const filtered = items
      .filter((item) =>
        item[displayField].toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const lengthDiff = a[displayField].length - b[displayField].length;
        if (lengthDiff !== 0) return lengthDiff;
        return a[displayField].localeCompare(b[displayField]);
      });
    setFilteredItems(filtered);
  }, [searchTerm, items, displayField]);

  const visibleItems = filteredItems.slice(0, visibleCount); // Show items up to visibleCount
  const remainingCount = filteredItems.length - visibleCount; // Calculate remaining items

  return (
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
      {loading ? (
        <Loading text="Načítání..." />
      ) : (
        <div className="w-card list h-full overflow-y-auto">
          {visibleItems.map((item) => (
            <ButtonReset
              key={item.id}
              apiPath={`/api/items/${item.id}/reset`}
              modalMessage={`Opravdu chcete resetovat pokrok slova "${item.czech}" - "${item.translation}"?`}
              className="h-8 px-2"
            >
              <div className="flex justify-between px-8 font-sans font-medium">
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
            </ButtonReset>
          ))}
          {remainingCount > 0 && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="mt-2 w-full text-center text-[var(--color-blue-3)] hover:underline"
            >
              ... a {remainingCount} dalších
            </button>
          )}
        </div>
      )}
    </div>
  );
}
