import { ButtonHTMLAttributes, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { buttonShapes, buttonColors } from './buttonStyles';

interface ButtonLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  to: string;
  color?: keyof typeof buttonColors;
  shape?: keyof typeof buttonShapes;
}

export default function ButtonLinkOld({
  children,
  isActive = true,
  className = '',
  to,
  shape = 'round',
  color = 'primary',
  ...props
}: ButtonLinkProps) {
  const shapeClass = buttonShapes[shape];
  const colorClass = isActive ? buttonColors[color] : buttonColors.inactive;

  const buttonClass = `flex items-center justify-center ${shapeClass} ${colorClass} ${className}`;

  return (
    <NavLink to={to}>
      <button
        className={buttonClass}
        disabled={!isActive}
        aria-disabled={!isActive}
        {...props}
      >
        {children}
      </button>
    </NavLink>
  );
}
