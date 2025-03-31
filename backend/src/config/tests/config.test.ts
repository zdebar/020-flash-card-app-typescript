import dotenv from "dotenv";
import path from "path";
import { describe, it, expect, afterAll } from "vitest";
import config from "../config";

describe("Environment Configuration", () => {
  afterAll(() => {
    process.env.NODE_ENV = "development";
  });

  it("should correctly resolve the path to the .env file", () => {
    const envPath = path.resolve(__dirname, "../../../.env");
    console.log(envPath);
    expect(envPath).toBeTruthy();
  });

  it("should load environment variables correctly", () => {
    dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.JWT_EXPIRES_IN).toBeDefined();
  });

  it("should be an array of numbers", () => {
    expect(Array.isArray(config.SRS)).toBe(true);
    config.SRS.forEach((item) => {
      expect(typeof item).toBe("number");
    });
    console.log(config.SRS);
  });
});
