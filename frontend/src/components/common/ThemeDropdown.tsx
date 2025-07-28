import React from 'react';
import { useUser } from '../../hooks/useUser';
import { UserTheme } from '../../../../shared/types/dataTypes';
import Label from './Label';

const themes: UserTheme[] = ['light', 'dark', 'system'];

export default function ThemeDropdown({ className }: { className?: string }) {
  const { theme, chooseTheme } = useUser();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as UserTheme;
    chooseTheme(selectedTheme);
  };

  return (
    <div className={`h-B centered ${className}`}>
      <Label text="Barevnost:" />
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className="color-background w-full"
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
