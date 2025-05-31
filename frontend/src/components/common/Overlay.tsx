interface OverlayProps {
  onClose: () => void;
  children?: React.ReactNode; // Accept children components
}

export default function Overlay({ onClose, children }: OverlayProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div
      className="card font-display absolute z-1 text-xl"
      role="dialog"
      style={{
        backgroundColor: !isDarkMode
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(17, 24, 39, 0.6)',
      }}
      aria-modal="true"
      onClick={onClose}
    >
      <div className="max-w-md">{children}</div>
    </div>
  );
}
