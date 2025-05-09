import ButtonLink from './ButtonLink';
import { ReactNode } from 'react';

interface ButtonLinkRectangularProps {
  children?: ReactNode;
  disabled?: boolean;
  buttonColor?: string;
  className?: string;
  to: string;
}

export default function ButtonLinkRectangular({
  children,
  disabled,
  buttonColor,
  className,
  to,
  ...props
}: ButtonLinkRectangularProps) {
  return (
    <ButtonLink
      className={`shape-rectangular ${className}`}
      disabled={disabled}
      buttonColor={buttonColor}
      to={to}
      {...props}
    >
      {children}
    </ButtonLink>
  );
}
