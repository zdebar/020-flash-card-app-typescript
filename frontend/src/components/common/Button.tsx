import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  buttonColor?: string;
  className?: string;
}

export default function Button({
  children,
  buttonColor = 'button-primary',
  className = '',
  ...props
}: ButtonProps) {
  const buttonClass = `flex items-center justify-center ${className} ${props.disabled ? 'color-disabled' : buttonColor}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
