import Button from './Button';

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
        className={`w-card color-disabled fixed top-2/5 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform border-2 border-white p-6 text-center ${className}`}
      >
        <h2 className="mb-6 text-lg font-bold">{text}</h2>
        <div className="flex justify-center gap-4">
          <Button onClick={onCancel}>Ne</Button>
          <Button onClick={onConfirm}>Ano</Button>
        </div>
      </div>

      {/* Overlay */}
      <div className="bg-opacity-50 fixed inset-0 z-40"></div>
    </>
  );
}
