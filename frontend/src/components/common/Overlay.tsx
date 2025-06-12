interface OverlayProps {
  onClose: () => void;
  children?: React.ReactNode; // Accept children components
}

export default function Overlay({ onClose, children }: OverlayProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleOverlayClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent clicks from propagating to elements below
    onClose();
  };

  return (
    <div
      className="font-display fixed inset-0 z-10 text-xl"
      role="dialog"
      style={{
        backgroundColor: !isDarkMode
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(17, 24, 39, 0.6)',
        pointerEvents: 'all', // Ensure overlay captures all interactions
      }}
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div
        className="mx-auto max-w-md"
        onClick={(event) => event.stopPropagation()} // Prevent clicks inside the overlay from closing it
      >
        {children}
      </div>
    </div>
  );
}
