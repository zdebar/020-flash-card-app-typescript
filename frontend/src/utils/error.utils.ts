import { PracticeError } from '../../../shared/types/dataTypes';

export function getErrorMessage(error: PracticeError | null) {
  switch (error) {
    case PracticeError.NoAudio:
      return 'Zvuk není k dispozici.';
    default:
      return '';
  }
}
