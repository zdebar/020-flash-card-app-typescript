import Label from './Label';

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export default function DirectionDropdown({
  label,
  value,
  options,
  onChange,
  className = '',
}: DropdownProps) {
  return (
    <div className={`shape-settings flex items-center ${className}`}>
      <Label text={label} />
      <select
        id="direction-dropdown"
        name="direction"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="shape-settings color-dropdown"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
