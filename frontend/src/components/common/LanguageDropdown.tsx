import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import config from '../../config/config';

const LanguageDropdown = () => {
  const { setLanguageID } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState<number>(
    parseInt(localStorage.getItem('selectedLanguageID') || '1', 10)
  );

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguageID = parseInt(event.target.value, 10);
    setSelectedLanguage(newLanguageID);
    localStorage.setItem('selectedLanguageID', newLanguageID.toString());
    setLanguageID(newLanguageID);
  };

  useEffect(() => {
    setLanguageID(selectedLanguage);
  }, [selectedLanguage, setLanguageID]);

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="language-select" className="w-40">
        Učený jazyk:
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="button-rectangular h-12 bg-white p-2 dark:bg-gray-900 dark:text-white"
        aria-label="Výběr jazyka"
      >
        {config.languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
