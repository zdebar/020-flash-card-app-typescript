import request from "supertest";
import { app } from "../../server";
import db from "../../config/database.config.postgres";
import * as userService from "../../services/user.service";
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("../../services/user.service");
vi.mock("../../config/database.config.postgres");

describe("Auth Controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/auth/register").send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Username, email and password are all required."
      );
    });

    it("should return 201 and a token if registration is successful", async () => {
      vi.spyOn(db, "connect").mockResolvedValueOnce();
      vi.spyOn(db, "end").mockResolvedValueOnce();
      vi.spyOn(userService, "registerUserService").mockResolvedValueOnce();
      vi.spyOn(userService, "loginUserService").mockResolvedValueOnce(
        "mocked-token"
      );

      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully.");
      expect(response.body.token).toBe("mocked-token");
    });

    it("should handle errors during registration", async () => {
      vi.spyOn(db, "connect").mockResolvedValueOnce();
      vi.spyOn(db, "end").mockResolvedValueOnce();
      vi.spyOn(userService, "registerUserService").mockRejectedValueOnce(
        new Error("Registration error")
      );

      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });

  describe("POST /login", () => {
    it("should return 400 if email or password is missing", async () => {
      const response = await request(app).post("/auth/login").send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email and password are required.");
    });

    it("should return 200 and a token if login is successful", async () => {
      vi.spyOn(db, "connect").mockResolvedValueOnce();
      vi.spyOn(db, "end").mockResolvedValueOnce();
      vi.spyOn(userService, "loginUserService").mockResolvedValueOnce(
        "mocked-token"
      );

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("mocked-token");
    });

    it("should handle errors during login", async () => {
      vi.spyOn(db, "connect").mockResolvedValueOnce();
      vi.spyOn(db, "end").mockResolvedValueOnce();
      vi.spyOn(userService, "loginUserService").mockRejectedValueOnce(
        new Error("Login error")
      );

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });

    it("should handle errors during login", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });
});
