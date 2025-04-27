import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

export default function RectangularButtonOnClick({
  children,
  isActive = true,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClass = `flex items-center justify-center h-10 w-full flex-grow ${className} ${
    isActive
      ? 'color-primary color-primary-hover'
      : 'color-secondary-disabled shadow-none'
  }`;

  return (
    <button
      className={buttonClass}
      disabled={!isActive}
      aria-disabled={!isActive}
      {...props}
    >
      {children}
    </button>
  );
}
