import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { Item } from '../../../shared/types/dataTypes';
import DirectionDropdown from './common/DirectionDropdown';
import ButtonReset from './common/ButtonReset';
import config from '../config/config';
import Loading from './common/Loading';

export default function WordSearch() {
  const { languageID, userScore } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayField, setDisplayField] = useState<'czech' | 'translation'>(
    'czech'
  );
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
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

  const visibleItems = filteredItems.slice(0, 10);
  const remainingCount = filteredItems.length - 10;

  return (
    <div className="w-card list h-full">
      {/* Toggle between czech and translation */}
      <DirectionDropdown
        value={displayField}
        options={[
          { value: 'czech', label: 'Čeština' },
          { value: 'translation', label: currLanguage.name },
        ]}
        onChange={(value) => setDisplayField(value as 'czech' | 'translation')}
      />
      {/* Search input */}
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Zadejte slovo..."
        className="h-B color-dropdown w-full px-10"
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
              modalMessage={`Opravdu chcete resetovat pokrok slova "${item[displayField]}"?`}
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
            <div className="text-center">... a {remainingCount} dalších</div>
          )}
        </div>
      )}
    </div>
  );
}
