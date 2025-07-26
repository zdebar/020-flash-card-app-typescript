import Label from './Label';

interface SettingPropertyProps {
  label: string;
  value: string | null | undefined;
  className?: string;
}

export default function SettingProperty({
  label,
  value,
  className = '',
}: SettingPropertyProps) {
  return (
    <div className={`shape-setting flex items-center ${className}`}>
      <Label text={label} /> <p>{value}</p>
    </div>
  );
}
