/**
 * Function converts request strings to number.
 * 
 * @param value 
 * @param paramName 
 * @returns parsed number
 */
export function parseAndValidateRequestValue(value: string | undefined | null, paramName: string): number {
  if (!value) {
    throw new Error(`${paramName} is required, but was not provided.`)
  }

  const numberValue = Number(value);
  if (isNaN(numberValue) || numberValue <= 0) {
    throw new Error(`Invalid ${paramName} number: ${value}`)
  }
  return numberValue;
}
