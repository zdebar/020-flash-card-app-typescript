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
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (props.disabled || loading) {
      return;
    }

    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <ButtonWithModal
      modalMessage={props.modalMessage}
      disabled={props.disabled || loading}
      className={props.className}
      onClick={handleReset}
      successMessage="reset se zdařil"
      failMessage="reset se nezdařil"
    >
      {props.children}
    </ButtonWithModal>
  );
}
