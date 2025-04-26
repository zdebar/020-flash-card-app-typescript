import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ButtonOnClick({
  children,
  className,
  onClick,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-12 w-full items-center justify-center ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
