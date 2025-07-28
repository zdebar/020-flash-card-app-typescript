import { ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface ButtonLinkProps extends Omit<LinkProps, 'to'> {
  children: ReactNode;
  disabled?: boolean;
  buttonType?: string;
  className?: string;
  to: string;
}

export default function ButtonLink({
  children,
  disabled = false,
  buttonType = 'button',
  className = '',
  to,
  ...props
}: ButtonLinkProps) {
  const buttonClass = `${buttonType} centered  ${className} `;

  if (disabled) {
    return (
      <button className={`${buttonClass} pointer-events-none`} disabled>
        {children}
      </button>
    );
  }

  return (
    <Link to={to} className={`${buttonClass} `} {...props}>
      {children}
    </Link>
  );
}
