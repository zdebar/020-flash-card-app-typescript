import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export default function PracticeButton({
  children,
  className,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex h-12 w-full items-center justify-center ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
