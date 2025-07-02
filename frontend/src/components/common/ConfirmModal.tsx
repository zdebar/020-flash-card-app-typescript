interface ConfirmModalProps {
  isVisible: boolean;
  text?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isVisible,
  text,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isVisible) return null;

  return (
    <div className="max-w-card color-modal absolute">
      <div className="p-6 text-center">
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
    </div>
  );
}
