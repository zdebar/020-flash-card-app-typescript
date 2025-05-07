import ButtonLink from './ButtonLink';
import { ReactNode } from 'react';

interface ButtonLinkRoundProps {
  children?: ReactNode;
  disabled?: boolean;
  buttonColor?: string;
  className?: string;
  to: string;
}

export default function ButtonLinkRound({
  children,
  disabled,
  buttonColor,
  className,
  to,
  ...props
}: ButtonLinkRoundProps) {
  return (
    <ButtonLink
      className={`h-12 w-12 rounded-full ${className}`}
      disabled={disabled}
      buttonColor={buttonColor}
      to={to}
      {...props}
    >
      {children}
    </ButtonLink>
  );
}
