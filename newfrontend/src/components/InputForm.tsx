import { InputHTMLAttributes, ChangeEvent } from 'react';

interface InputFormProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function InputForm({
  type,
  label,
  placeholder,
  value,
  onChange,
  ...props
}: InputFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={label}
        className="mb-1 block text-sm font-semibold text-black"
      >
        {label}
      </label>
      <input
        type={type}
        id={label}
        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
        {...props}
      />
    </div>
  );
}
