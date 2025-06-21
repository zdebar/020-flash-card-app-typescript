/**
 * Validates that all required environment variables are defined and non-empty. Error otherwise.
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

/**
 * Validates that the provided UID is a non-empty string.
 * @param uid
 */
export function validateUid(uid: string): void {
  if (!uid || typeof uid !== "string") {
    throw new Error(`Invalid UID parameter: ${uid}`);
  }
}

/**
 * Validates that the provided name is a non-empty string containing only letters and spaces.
 * @param name
 * @returns
 */
export function validateName(name: string | null): boolean {
  if (!name) return false; // Null or empty
  const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
  return nameRegex.test(name);
}

/**
 * Validates that the provided email is in a basic email format.
 * @param email
 * @returns
 */
export function validateEmail(email: string | null): boolean {
  if (!email) return false; // Null or empty
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
  return emailRegex.test(email);
}
