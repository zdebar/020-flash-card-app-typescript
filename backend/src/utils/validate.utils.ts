import { UserError } from "../../../shared/types/dataTypes";

/**
 * Validates that all required user fields in the provided object are present and not empty.
 * Additionally, performs common validations such as email format, length, and numeric checks.
 *
 * @param fields - An object where keys represent field names and values represent their corresponding values.
 * @throws {UserError} If any field is missing, invalid, or fails specific validations.
 */
export function validateRequiredUserFields(fields: Record<string, any>): void {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      throw new UserError(`Pole "${key}" je vyžadováno.`);
    }

    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new UserError(`Email musí obsahovat platnou e-mailovou adresu.`);
    }

    if (key === "password") {
      if (value.length < 8 || value.length > 128) {
        throw new UserError(`Heslo musí mít délku mezi 8 a 128 znaky.`);
      }
      if (!/[A-Z]/.test(value)) {
        throw new UserError(
          `Heslo musí obsahovat alespoň jedno velké písmeno.`
        );
      }
      if (!/[a-z]/.test(value)) {
        throw new UserError(`Heslo musí obsahovat alespoň jedno malé písmeno.`);
      }
      if (!/[0-9]/.test(value)) {
        throw new UserError(`Heslo musí obsahovat alespoň jednu číslici.`);
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        throw new UserError(
          `Heslo musí obsahovat alespoň jeden speciální znak.`
        );
      }
    }

    if (key === "username" && (value.length < 2 || value.length > 50)) {
      throw new UserError(
        `Uživatelské jméno musí mít délku mezi 2 a 50 znaky.`
      );
    }
  }
}

/**
 * Validates that all required environment variables are defined and non-empty.
 * Throws an error if any required variable is missing or empty.
 *
 * @param requiredVariables - An array of environment variable names to validate.
 * Each name can be a string or undefined. Undefined values are ignored.
 *
 * @throws {Error} If any required environment variable is not defined or is an empty string.
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
}
