import ButtonLink from './ButtonLink';
import { CloseIcon } from './Icons';

export default function CloseButton({
  toLink,
  className = '',
}: {
  toLink: string;
  className?: string;
}) {
  return (
    <ButtonLink
      className={`h-full flex-shrink-0 flex-grow-0 ${className}`}
      aria-label="Zpět na přehled uživatele"
      to={toLink}
    >
      <CloseIcon />
    </ButtonLink>
  );
}
