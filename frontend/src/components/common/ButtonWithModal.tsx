import Button, { ButtonProps } from '../common/Button';

import ConfirmModal from '../common/ConfirmModal';
import { useState } from 'react';

export interface ButtonWithModalProps extends ButtonProps {
  onClick: () => void;
  modalMessage: string;
  successMessage?: string;
  failMessage?: string;
}

export default function ButtonWithModal({
  onClick,
  modalMessage,
  className,
  successMessage = '',
  failMessage = '',
  ...props
}: ButtonWithModalProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState(null as string | null);

  const handleOnClick = async () => {
    setIsLoading(true);
    try {
      onClick();
      setIsMessage(successMessage);
    } catch (error) {
      console.error('Error: ', error);
      setIsMessage(failMessage);
    } finally {
      setTimeout(() => {
        setIsMessage(null);
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      <Button
        className={`${className}`}
        onClick={() => setModalVisible(true)}
        disabled={props.disabled || isLoading}
      >
        {isMessage ? (
          <p className="notice w-full text-center">{isMessage}</p>
        ) : (
          <div className="w-full">{props.children}</div>
        )}
      </Button>
      <ConfirmModal
        isVisible={isModalVisible}
        text={modalMessage}
        onConfirm={() => {
          setModalVisible(false);
          handleOnClick();
        }}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
}
