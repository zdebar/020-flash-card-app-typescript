import { ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface ButtonLinkProps extends Omit<LinkProps, 'to'> {
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
  const buttonClass = `flex items-center justify-center px-4 py-2  ${className} ${
    disabled ? 'color-disabled pointer-events-none' : buttonColor
  }`;

  if (disabled) {
    return (
      <span className={buttonClass} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link to={to} className={buttonClass} {...props}>
      {children}
    </Link>
  );
}
