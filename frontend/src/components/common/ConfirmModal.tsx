interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="bg-opacity-0 fixed inset-0 flex justify-center bg-black pt-40">
      <div className="flex h-[120px] w-[320px] flex-col items-center justify-between rounded bg-white p-2 shadow">
        <p className="flex h-full w-full flex-col items-center justify-center">
          {message}
        </p>

        <div className="flex w-full justify-between gap-1">
          <button
            onClick={onCancel}
            className="flex-1 rounded bg-gray-300 px-4 py-2"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Potvrdit
          </button>
        </div>
      </div>
    </div>
  );
}
