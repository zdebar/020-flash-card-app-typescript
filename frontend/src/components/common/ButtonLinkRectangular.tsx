import ButtonLink from './ButtonLink';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonLinkRectangularProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  to: string;
}

export default function ButtonLinkRectangular({
  children,
  disabled = false,
  className = '',
  to,
  ...props
}: ButtonLinkRectangularProps) {
  return (
    <ButtonLink
      className={`button-rectangular ${className}`}
      disabled={disabled}
      to={to}
      {...props}
    >
      {children}
    </ButtonLink>
  );
}
