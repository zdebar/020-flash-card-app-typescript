import { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonShapes, buttonColors } from './buttonStyles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  color?: keyof typeof buttonColors;
  shape?: keyof typeof buttonShapes;
}

export default function Button({
  children,
  isActive = true,
  className = '',
  shape = 'rectangular',
  color = 'primary',
  ...props
}: ButtonProps) {
  const shapeClass = buttonShapes[shape];
  const colorClass = isActive ? buttonColors[color] : buttonColors.inactive;

  const buttonClass = `flex items-center justify-center ${shapeClass} ${colorClass} ${className}`;

  return (
    <button
      className={buttonClass}
      disabled={!isActive}
      aria-disabled={!isActive}
      {...props}
    >
      {children}
    </button>
  );
}
