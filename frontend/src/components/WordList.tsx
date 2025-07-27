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
      .sort((a, b) => a[displayField].length - b[displayField].length)
      .splice(0, 10); // Limit to 100 items for performance
    setFilteredItems(filtered);
  }, [searchTerm, items, displayField]);

  return (
    <div className="max-w-card gap-tiny flex h-full flex-col">
      {/* Toggle between czech and translation */}
      <DirectionDropdown
        label="Jazyk:"
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
        className="shape-settings color-dropdown"
      />
      {/* Filtered items */}
      {loading ? (
        <Loading text="Načítání..." />
      ) : (
        <div className="max-w-card gap-tiny flex h-full flex-col overflow-y-auto">
          {filteredItems.map((item) => (
            <ButtonReset
              key={item.id}
              apiPath={`/api/items/${item.id}/reset`}
              modalMessage={`Opravdu chcete resetovat slovo "${item[displayField]}"?`}
              className="button-rectangular flex h-8 justify-start px-2"
            >
              <div className="flex w-full justify-between px-8">
                <span>{item.czech}</span>
                <span>{item.translation}</span>
              </div>
            </ButtonReset>
          ))}
        </div>
      )}
    </div>
  );
}
