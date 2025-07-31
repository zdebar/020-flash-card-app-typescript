import CloseButton from './CloseButton';
import Button from './Button';

export default function TopBar({
  text,
  toLink,
  className = '',
}: {
  text: string;
  toLink: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-1 ${className}`}>
      <Button disabled={true}>{text}</Button>
      <CloseButton toLink={toLink} className="h-A w-A" />
    </div>
  );
}
