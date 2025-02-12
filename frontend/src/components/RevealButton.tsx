import "./RevealButton.css";

interface RevealButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RevealButton({ onClick }: RevealButtonProps) {
  return (
    <button onClick={onClick} className="revealButton flex justify-center align-center border">
      Reveal
    </button>
  );
}
