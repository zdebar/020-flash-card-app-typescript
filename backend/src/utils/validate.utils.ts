import { UserError } from "../types/dataTypes";

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
 * Validates the required user fields for registration or login.
 */
export function validateRequiredUserFields(fields: Record<string, any>): void {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      throw new UserError(`Pole "${key}" je vyžadováno.`);
    }

    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new UserError(`Email musí obsahovat platnou e-mailovou adresu.`);
    } else if (key === "password") {
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
    } else if (key === "username" && (value.length < 2 || value.length > 50)) {
      throw new UserError(
        `Uživatelské jméno musí mít délku mezi 2 a 50 znaky.`
      );
    }
  }
}
