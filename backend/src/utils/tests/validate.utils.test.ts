import { describe, it, expect } from "vitest";
import {
  validateRequiredUserFields,
  validateEnvVariables,
} from "../validate.utils";
import { UserError } from "../../../../shared/types/dataTypes";

/**
 * validateRequire
 */
describe("validateRequiredUserFields", () => {
  it("should throw an error if a required field is missing", () => {
    expect(() =>
      validateRequiredUserFields({ username: "", email: "test@example.com" })
    ).toThrowError(new UserError('Pole "username" je vyžadováno.'));
  });

  it("should throw an error for invalid email format", () => {
    expect(() =>
      validateRequiredUserFields({ email: "invalid-email" })
    ).toThrowError(
      new UserError("Email musí obsahovat platnou e-mailovou adresu.")
    );
  });

  it("should throw an error for weak passwords", () => {
    expect(() =>
      validateRequiredUserFields({ password: "short" })
    ).toThrowError(new UserError("Heslo musí mít délku mezi 8 a 128 znaky."));
    expect(() =>
      validateRequiredUserFields({ password: "alllowercase1!" })
    ).toThrowError(
      new UserError("Heslo musí obsahovat alespoň jedno velké písmeno.")
    );
    expect(() =>
      validateRequiredUserFields({ password: "ALLUPPERCASE1!" })
    ).toThrowError(
      new UserError("Heslo musí obsahovat alespoň jedno malé písmeno.")
    );
    expect(() =>
      validateRequiredUserFields({ password: "NoNumbers!" })
    ).toThrowError(
      new UserError("Heslo musí obsahovat alespoň jednu číslici.")
    );
    expect(() =>
      validateRequiredUserFields({ password: "NoSpecialChar1" })
    ).toThrowError(
      new UserError("Heslo musí obsahovat alespoň jeden speciální znak.")
    );
  });

  it("should throw an error for invalid username length", () => {
    expect(() => validateRequiredUserFields({ username: "a" })).toThrowError(
      new UserError("Uživatelské jméno musí mít délku mezi 2 a 50 znaky.")
    );
    expect(() =>
      validateRequiredUserFields({ username: "a".repeat(51) })
    ).toThrowError(
      new UserError("Uživatelské jméno musí mít délku mezi 2 a 50 znaky.")
    );
  });

  it("should not throw an error for valid fields", () => {
    expect(() =>
      validateRequiredUserFields({
        username: "validUser",
        email: "test@example.com",
        password: "ValidPass1!",
      })
    ).not.toThrow();
  });
});

describe("validateEnvVariables", () => {
  it("should throw an error if a required environment variable is missing", () => {
    expect(() => validateEnvVariables(["MISSING_ENV_VAR"])).toThrowError(
      'Environment variable "MISSING_ENV_VAR" is required but not provided.'
    );
  });

  it("should not throw an error if all required environment variables are defined", () => {
    process.env.TEST_ENV_VAR = "value";
    expect(() => validateEnvVariables(["TEST_ENV_VAR"])).not.toThrow();
  });
});
