import { describe, it, expect, afterAll } from "vitest";
import postgresDB from "../database.config.postgres";

describe("Database Configuration Test", () => {
  afterAll(() => {
    process.env.NODE_ENV = "development";
  });

  it("should have the correct PostgreSQL connection settings from environment variables", () => {
    console.log("DB_HOST:", postgresDB.host);
    console.log("DB_PORT:", postgresDB.port);
    console.log("DB_NAME:", postgresDB.database);
    console.log("DB_USER:", postgresDB.user);
    console.log("DB_PASSWORD:", postgresDB.password);

    expect(postgresDB.host).toBeDefined();
    expect(postgresDB.port).toBeDefined();
    expect(postgresDB.database).toBeDefined();
    expect(postgresDB.user).toBeDefined();
    expect(postgresDB.password).toBeDefined();
  });
});
