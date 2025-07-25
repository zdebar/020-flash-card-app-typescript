import Button from '../common/Button';
import { fetchWithAuthAndParse } from '../../utils/auth.utils';
import ConfirmModal from '../common/ConfirmModal';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { UserScore } from '../../../../shared/types/dataTypes';

export default function ButtonReset({
  apiPath,
  modalMessage,
  canReset = false,
  children,
  className,
}: {
  apiPath: string;
  modalMessage: string;
  canReset?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const { setUserScore } = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState(null as string | null);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuthAndParse<{
        score: UserScore[] | null;
      }>(apiPath, {
        method: 'DELETE',
      });

      if (response) {
        setIsMessage('reset se zdařil');
        setUserScore(response?.score || null);
      } else {
        setIsMessage('reset se nezdařil');
      }
    } catch (error) {
      console.error('Error reseting. apiPath:', apiPath, 'Error:', error);
      setIsMessage('reset se nezdařil');
    } finally {
      setTimeout(() => {
        setIsMessage(null);
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className={`${className}`}>
      <Button
        className={`button-rectangular flex w-full items-center pt-1 ${!canReset && 'color-disabled'}`}
        onClick={() => setModalVisible(true)}
        disabled={!canReset || isLoading}
      >
        {isMessage ? (
          <p className="color-error text-center">{isMessage}</p>
        ) : (
          <div className="w-full justify-start">{children}</div>
        )}
      </Button>
      <ConfirmModal
        isVisible={isModalVisible}
        text={modalMessage}
        onConfirm={() => {
          setModalVisible(false);
          handleReset();
        }}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
}
