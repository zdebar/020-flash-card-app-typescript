import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
}

export default function Button({
  children,
  isActive = true,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex h-10 w-full items-center justify-center ${className} ${
        isActive
          ? 'color-primary color-primary-hover'
          : 'color-secondary shadow-none'
      }`}
      disabled={!isActive}
      {...props}
    >
      {children}
    </button>
  );
}
