import { LinkProps, NavLink } from 'react-router-dom';
import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  to: LinkProps['to'];
  className?: string;
  disabled?: boolean;
};

export default function ButtonLink({
  children,
  to,
  className = '',
  disabled = false,
}: ButtonProps) {
  return disabled ? (
    <div
      className={`color-secondary my-2 flex h-10 w-full items-center justify-center rounded-md ${className}`}
    >
      {children}
    </div>
  ) : (
    <NavLink to={to} className={className}>
      <button
        className={`color-primary color-primary-hover my-2 flex h-10 w-full items-center justify-center rounded-md ${className}`}
      >
        {children}
      </button>
    </NavLink>
  );
}
