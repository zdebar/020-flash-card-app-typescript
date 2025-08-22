export function formatError(
  error: unknown,
  functionName: string,
  params: Record<string, any>
) {
  const paramStr = Object.entries(params)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(", ");
  const stack =
    error instanceof Error && error.stack
      ? error.stack.split("\n")[1]?.trim()
      : "";
  return `Error in ${functionName}(${paramStr}): ${
    (error as any).message
  } | ${stack}`;
}
