/**
 * Handles errors and sets an appropriate error message.
 *
 * @param error - The error to handle.
 * @param setError - A function to set the error message.
 */
export function handleAPIError(
  error: unknown,
  setError: (message: string) => void
): void {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('Došlo k neznámé chybě.');
  }
}
