import { ButtonHTMLAttributes, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface ButtonLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  to: string;
}

export default function ButtonLink({
  children,
  disabled = false,
  className = '',
  to,
  ...props
}: ButtonLinkProps) {
  const buttonClass = `flex items-center justify-center ${className} ${!disabled ? 'button-primary' : 'button-disabled'}`;

  return (
    <NavLink to={to}>
      <button
        className={buttonClass}
        disabled={disabled}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </NavLink>
  );
}
