interface RevealButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RevealButton({ onClick }: RevealButtonProps) {
  return (
    <button onClick={onClick} className="flex justify-center align-center border h-10 mt-1" style={{ borderRadius: '0px 0px var(--border-radius) var(--border-radius)' }}>
      Reveal
    </button>
  );
}
