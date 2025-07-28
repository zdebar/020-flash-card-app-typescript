import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import config from '../../config/config';
import Label from './Label';

export default function LanguageDropdown({
  className = '',
}: {
  className?: string;
}) {
  const { setLanguageID } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState<number>(
    parseInt(
      localStorage.getItem('selectedLanguageID') ||
        String(config.defaultLanguageID),
      10
    )
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
    <div className={`h-B centered ${className}`}>
      <Label text="Učený jazyk:" />
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="color-background h-full w-full"
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
}
