import Button from './Button';
import { ReactNode, MouseEventHandler } from 'react';

interface ButtonProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function RectangularButton({
  children,
  isActive = true,
  className = '',
  to,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={`h-10 w-full ${className}`}
      isActive={isActive}
      to={to}
      {...props}
    >
      {children}
    </Button>
  );
}
