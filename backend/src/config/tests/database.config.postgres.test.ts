import { describe, it, expect, afterAll } from "vitest";
import { checkDatabaseConnection } from "../../utils/database.utils";

describe("Database Configuration Test", () => {
  it("should have the correct PostgreSQL connection settings from environment variables", async () => {
    await expect(checkDatabaseConnection()).resolves.not.toThrow();
  });
});
