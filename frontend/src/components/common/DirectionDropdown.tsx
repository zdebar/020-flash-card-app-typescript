export default function DirectionDropdown({
  value,
  options,
  onChange,
  className = '',
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`centered ${className}`}>
      <select
        id="direction-dropdown"
        name="direction"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="color-disabled h-A mb-1 h-full w-full pl-2"
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
