import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  buttonType?: string;
}

export default function Button({
  children,
  className = '',
  disabled = false,
  buttonType = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${className} ${disabled && 'color-disabled'} ${buttonType}`}
      {...props}
    >
      {children}
    </button>
  );
}
