import { describe, it, expect, afterAll } from "vitest";
import postgresDBClient from "../database.config.postgres";

describe("Database Configuration Test", () => {
  afterAll(() => {
    process.env.NODE_ENV = "development";
  });

  it("should have the correct PostgreSQL connection settings from environment variables", () => {
    console.log("DB_HOST:", postgresDBClient.host);
    console.log("DB_PORT:", postgresDBClient.port);
    console.log("DB_NAME:", postgresDBClient.database);
    console.log("DB_USER:", postgresDBClient.user);
    console.log("DB_PASSWORD:", postgresDBClient.password);

    expect(postgresDBClient.host).toBeDefined();
    expect(postgresDBClient.port).toBeDefined();
    expect(postgresDBClient.database).toBeDefined();
    expect(postgresDBClient.user).toBeDefined();
    expect(postgresDBClient.password).toBeDefined();
  });
});
