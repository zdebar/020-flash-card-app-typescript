import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
}

export default function SubmitButton({
  children,
  isActive = true,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`flex h-10 w-full items-center justify-center rounded-md ${
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
