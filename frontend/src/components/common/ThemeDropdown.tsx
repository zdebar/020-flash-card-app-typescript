import React from 'react';
import { useUser } from '../../hooks/useUser';
import { UserTheme } from '../../../../shared/types/dataTypes';

const themes: UserTheme[] = ['light', 'dark', 'system'];

export default function ThemeDropdown() {
  const { theme, chooseTheme } = useUser();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as UserTheme;
    chooseTheme(selectedTheme);
  };

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="theme-select" className="text-sm font-medium">
        Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className="button-rectangular bg-white p-2 dark:bg-gray-900 dark:text-white"
        aria-label="Změna motivu"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
