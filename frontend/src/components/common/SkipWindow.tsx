import Button from './Button';

interface SkipWindowProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SkipWindow({
  message,
  onConfirm,
  onCancel,
}: SkipWindowProps) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex h-[160px] w-[320px] flex-col justify-between bg-white shadow-lg">
        <p className="mb-4 pt-8 text-center text-lg font-semibold">{message}</p>

        <div className="flex justify-between gap-1">
          <Button onClick={onCancel} color="secondary" className="w-full">
            Zpět
          </Button>
          <Button onClick={onConfirm} color="primary" className="w-full">
            Ano
          </Button>
        </div>
      </div>
    </div>
  );
}
