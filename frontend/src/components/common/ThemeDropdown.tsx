import React from 'react';
import { useUser } from '../../hooks/useUser';
import { UserTheme } from '../../../../shared/types/dataTypes';

export default function ThemeDropdown() {
  const { theme, chooseTheme } = useUser();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as UserTheme;
    chooseTheme(selectedTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium">
        Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className="rounded border p-2"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
