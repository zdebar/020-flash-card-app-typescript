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
      className={`shape-round ${className}`}
      disabled={disabled}
      buttonColor={buttonColor}
      to={to}
      {...props}
    >
      {children}
    </ButtonLink>
  );
}
