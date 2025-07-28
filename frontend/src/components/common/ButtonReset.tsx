import ButtonWithModal, { ButtonWithModalProps } from './ButtonWithModal';
import { fetchWithAuthAndParse } from '../../utils/auth.utils';
import { useUser } from '../../hooks/useUser';
import { UserScore } from '../../../../shared/types/dataTypes';
import { useState } from 'react';

export interface ButtonResetProps
  extends Omit<ButtonWithModalProps, 'onClick'> {
  apiPath: string;
}

export default function ButtonReset({ apiPath, ...props }: ButtonResetProps) {
  const { setUserScore } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (props.disabled || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchWithAuthAndParse<{
        score: UserScore[] | null;
      }>(apiPath, {
        method: 'DELETE',
      });

      if (response) {
        setUserScore(response?.score || null);
      } else {
        throw new Error(`Reset failed: ${apiPath}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ButtonWithModal
      modalMessage={props.modalMessage}
      disabled={props.disabled || isLoading}
      className={props.className}
      onClick={handleReset}
      successMessage="reset se zdařil"
      failMessage="reset se nezdařil"
    >
      {props.children}
    </ButtonWithModal>
  );
}
