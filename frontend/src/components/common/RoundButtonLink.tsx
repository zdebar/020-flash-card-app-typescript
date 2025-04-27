import { ButtonHTMLAttributes, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  to: string;
}

export default function RoundButtonLink({
  children,
  isActive = true,
  className = '',
  to,
  ...props
}: ButtonProps) {
  const buttonClass = `flex items-center justify-center h-12 w-12 rounded-full ${className} ${
    isActive
      ? 'color-primary color-primary-hover'
      : 'color-secondary-disabled shadow-none'
  }`;

  return (
    <NavLink to={to}>
      <button className={buttonClass} disabled={!isActive} {...props}>
        {children}
      </button>
    </NavLink>
  );
}
