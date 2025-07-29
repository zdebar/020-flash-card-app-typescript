import React from 'react';
import { useUser } from '../../hooks/useUser';
import { UserTheme } from '../../../../shared/types/dataTypes';
import Label from './Label';

const themeOptions: { label: string; value: UserTheme }[] = [
  { label: 'Světlý', value: 'light' },
  { label: 'Tmavý', value: 'dark' },
  { label: 'Systém', value: 'system' },
];

export default function ThemeDropdown({ className }: { className?: string }) {
  const { theme, chooseTheme } = useUser();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as UserTheme;
    chooseTheme(selectedTheme);
  };

  return (
    <div className={`h-B centered ${className}`}>
      <Label text="Vzhled:" />
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className="color-background w-full"
        aria-label="Změna motivu"
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
