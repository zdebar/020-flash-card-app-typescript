// components/RoundButton.tsx
import { LinkProps, NavLink } from 'react-router-dom';
import { ReactNode } from 'react';

type RoundButtonProps = {
  children: ReactNode;
  to: LinkProps['to'];
  className?: string;
};

export function RoundButton({
  children,
  to,
  className = '',
}: RoundButtonProps) {
  return (
    <NavLink to={to} className={className}>
      <button
        className={`color-blue color-blue-hover flex h-12 w-12 items-center justify-center rounded-full`}
      >
        {children}
      </button>
    </NavLink>
  );
}
