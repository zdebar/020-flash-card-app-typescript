import { ButtonHTMLAttributes, ReactNode, MouseEventHandler } from 'react';
import { NavLink } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  children,
  isActive = true,
  className,
  to,
  ...props
}: ButtonProps) {
  return (
    <NavLink to={to || '#'}>
      <button
        className={`flex items-center justify-center ${className} ${
          isActive
            ? 'color-primary color-primary-hover'
            : 'color-secondary shadow-none'
        }`}
        disabled={!isActive}
        {...props}
      >
        {children}
      </button>
    </NavLink>
  );
}
