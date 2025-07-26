interface ConfirmModalProps {
  isVisible: boolean;
  text?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export default function ConfirmModal({
  isVisible,
  text,
  onConfirm,
  onCancel,
  className,
}: ConfirmModalProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* Modal */}
      <div
        className={`w-card color-disabled absolute z-50 p-6 text-center ${className}`}
      >
        <h2 className="mb-6 text-lg font-bold">{text}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="color-primary button-rectangular"
          >
            Ne
          </button>
          <button
            onClick={onConfirm}
            className="color-primary button-rectangular"
          >
            Ano
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div className="bg-opacity-50 fixed inset-0 z-40"></div>
    </>
  );
}
