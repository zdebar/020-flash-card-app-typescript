import Button from './Button';
import { ReactNode } from 'react';
import { MouseEventHandler } from 'react';

interface ButtonProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function RoundButton({
  children,
  isActive = true,
  className = '',
  to,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={`h-12 w-12 rounded-full ${className}`}
      isActive={isActive}
      to={to}
      {...props}
    >
      {children}
    </Button>
  );
}
