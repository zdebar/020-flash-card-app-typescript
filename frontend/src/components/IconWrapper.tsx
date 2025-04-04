import { ReactNode } from 'react';

type IconWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function IconWrapper({ children, className }: IconWrapperProps) {
  return (
    <div className={`rounded-full p-1`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${className}`}
      >
        {children}
      </svg>
    </div>
  );
}
