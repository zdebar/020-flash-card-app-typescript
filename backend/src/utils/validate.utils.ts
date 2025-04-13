/**
 * Validates that all required environment variables are defined and non-empty.
 * Throws an error if any required variable is missing or empty.
 */
export function validateEnvVariables(
  requiredVariables: (string | undefined)[]
): void {
  requiredVariables.forEach((name) => {
    if (!name || !process.env[name] || process.env[name]?.trim() === "") {
      throw new Error(
        `Environment variable "${name}" is required but not provided.`
      );
    }
  });
  console.log("All required environment variables are set.");
}
