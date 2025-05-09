import { useState } from 'react';
import Button from './Button';
import { SlashBookmarkIcon } from './Icons';
import ConfirmModal from './ConfirmModal';

interface SkipButtonProps {
  onSkip: () => void;
}

export default function SkipButton({ onSkip }: SkipButtonProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirm = () => {
    onSkip();
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="flex-2">
      <Button
        onClick={() => setShowConfirmModal(true)}
        buttonColor="button-secondary"
      >
        <SlashBookmarkIcon />
      </Button>
      {showConfirmModal && (
        <ConfirmModal
          message="Vyloučit slovíčko z procvičování?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
