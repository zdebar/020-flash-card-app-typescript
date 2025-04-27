import { ReactNode, SVGProps } from 'react';

interface IconWrapperProps extends SVGProps<SVGSVGElement> {
  children: ReactNode;
  className?: string;
}

export default function IconWrapper({
  children,
  className,
  ...svgProps
}: IconWrapperProps) {
  return (
    <div className={`rounded-full p-1`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${className}`}
        {...svgProps}
      >
        {children}
      </svg>
    </div>
  );
}
