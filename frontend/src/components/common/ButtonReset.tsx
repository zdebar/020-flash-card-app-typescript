import ButtonWithModal, { ButtonWithModalProps } from './ButtonWithModal';
import { fetchWithAuthAndParse } from '../../utils/auth.utils';
import { useUser } from '../../hooks/useUser';
import { UserScore } from '../../../../shared/types/dataTypes';

export interface ButtonResetProps
  extends Omit<ButtonWithModalProps, 'onClick'> {
  apiPath: string;
}

export default function ButtonReset({ apiPath, ...props }: ButtonResetProps) {
  const { setUserScore } = useUser();

  const handleReset = async () => {
    const response = await fetchWithAuthAndParse<{ score: UserScore[] | null }>(
      apiPath,
      {
        method: 'DELETE',
      }
    );

    if (response) {
      setUserScore(response?.score || null);
    } else {
      throw new Error('Reset failed');
    }
  };

  return (
    <ButtonWithModal
      modalMessage={props.modalMessage}
      disabled={props.disabled}
      className={props.className}
      onClick={handleReset}
      successMessage="reset se zdařil"
      failMessage="reset se nezdařil"
    >
      {props.children}
    </ButtonWithModal>
  );
}
