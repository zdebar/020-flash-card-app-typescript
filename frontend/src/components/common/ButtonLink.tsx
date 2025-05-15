import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  children?: ReactNode;
  disabled?: boolean;
  buttonColor?: string;
  className?: string;
  to: string;
}

export default function ButtonLink({
  children,
  disabled = false,
  buttonColor = 'button-primary',
  className = '',
  to,
  ...props
}: ButtonLinkProps) {
  const buttonClass = `flex items-center justify-center px-4 py-2 ${className} ${
    !disabled ? buttonColor : 'color-disabled pointer-events-none'
  }`;

  return (
    <Link
      to={disabled ? '#' : to}
      className={buttonClass}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </Link>
  );
}
