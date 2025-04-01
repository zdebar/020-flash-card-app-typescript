import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`color-primary color-primary-hover flex h-10 w-full items-center justify-center rounded-md`}
      {...props}
    >
      {children}
    </button>
  );
}
