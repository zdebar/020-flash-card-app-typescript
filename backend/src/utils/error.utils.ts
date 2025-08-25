export function formatRepositoryError(
  error: unknown,
  functionName: string,
  params: Record<string, any>
) {
  const paramStr = Object.entries(params)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
  return `Error in ${functionName}(${paramStr}): ${(error as any).message}`;
}
