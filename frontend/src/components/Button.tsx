// components/RoundButton.tsx
import { LinkProps, NavLink } from 'react-router-dom';
import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  to: LinkProps['to'];
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  to,
  className = '',
  disabled = false,
}: ButtonProps) {
  return disabled ? (
    <div
      className={`color-secondary flex h-12 w-12 items-center justify-center ${className}`}
    >
      {children}
    </div>
  ) : (
    <NavLink to={to} className={className}>
      <button
        className={`color-primary color-primary-hover flex h-12 w-12 items-center justify-center ${className}`}
      >
        {children}
      </button>
    </NavLink>
  );
}
