export default function Overlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children?: React.ReactNode;
}) {
  const handleOverlayClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent clicks from propagating to elements below
    onClose();
  };

  return (
    <div
      className="color-overlay fixed inset-0 z-10"
      role="dialog"
      style={{
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
