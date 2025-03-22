interface RevealButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RevealButton({ onClick }: RevealButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className="btn btn-primary btn-lg w-full mt-1 rounded-b-lg"
    >
      Reveal
    </button>
  );
}

