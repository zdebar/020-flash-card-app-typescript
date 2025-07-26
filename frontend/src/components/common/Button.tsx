import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  buttonColor?: string;
  className?: string;
}

export default function Button({
  children,
  buttonColor = 'color-primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${className} ${props.disabled ? 'color-disabled' : buttonColor}`}
      {...props}
    >
      {children}
    </button>
  );
}
