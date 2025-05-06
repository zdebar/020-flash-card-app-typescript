import ButtonLink from './ButtonLink';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonLinkRoundProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  to: string;
}

export default function ButtonLinkRound({
  children,
  disabled = false,
  className = '',
  to,
  ...props
}: ButtonLinkRoundProps) {
  return (
    <ButtonLink
      className={`button-round ${className}`}
      disabled={disabled}
      to={to}
      {...props}
    >
      {children}
    </ButtonLink>
  );
}
