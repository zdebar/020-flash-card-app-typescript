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
    if (props.disabled || isLoading) {
      return;
    }
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
      }, 1000);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={() => !props.disabled && setModalVisible(true)}
        disabled={props.disabled || isLoading}
        className={`${className} w-full`}
      >
        {isMessage ? (
          <p className={`notice w-full text-center`}>{isMessage}</p>
        ) : (
          <>{props.children}</>
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
