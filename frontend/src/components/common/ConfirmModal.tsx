interface ConfirmModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isVisible,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isVisible) return null;

  return (
    <div className="card absolute">
      <div className="rounded-sm bg-white p-6 text-center shadow-lg dark:bg-gray-800 dark:text-white">
        <h2 className="mb-6 text-lg font-bold">Skutečně se chcete odhlásit?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="button-gray button-rectangular rounded-sm"
          >
            Ne
          </button>
          <button
            onClick={onConfirm}
            className="button-primary button-rectangular rounded-sm"
          >
            Ano
          </button>
        </div>
      </div>
    </div>
  );
}
