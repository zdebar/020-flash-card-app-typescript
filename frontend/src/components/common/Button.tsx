import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  disabled?: boolean;
  buttonColor?: string;
  className?: string;
}

export default function Button({
  children,
  disabled = false,
  buttonColor = 'button-primary',
  className = '',
  ...props
}: ButtonProps) {
  const buttonClass = `flex items-center justify-center shape-rectangular ${className} ${!disabled ? buttonColor : 'color-disabled'}`;

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
