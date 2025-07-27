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
  buttonColor = 'color-primary',
  className = '',
  to,
  ...props
}: ButtonLinkProps) {
  const buttonClass = `flex items-center justify-center ${className} `;

  if (disabled) {
    return (
      <span
        className={`${buttonClass} color-header-disabled pointer-events-none`}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link to={to} className={`${buttonClass} ${buttonColor}`} {...props}>
      {children}
    </Link>
  );
}
