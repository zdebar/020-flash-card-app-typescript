import request from "supertest";
import { app } from "../../server";
import { postgresDBPool } from "../../config/database.config.postgres";
import * as userService from "../../services/user.service";
import { describe, it, expect, vi, afterEach } from "vitest";

describe("Auth Controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * registerUserController
   * - register with valid data DONE
   * - does not register with missing data DONE
   * - does not register with invalid token DONE
   *
   */
  describe("POST /auth/register", () => {
    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/auth/register").send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Uživatelské jméno, email, i heslo jsou vyžadovány."
      );
    });

    it("should return 201 and a token if registration is successful", async () => {
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
      expect(response.body.message).toBe("Uživatel úspěšně zaregistrován.");
      expect(response.body.token).toBe("mocked-token");
    });

    it("should handle errors during registration", async () => {
      vi.spyOn(userService, "registerUserService").mockRejectedValueOnce(
        new Error("Registration error")
      );

      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Interní chyba serveru" });
    });
  });

  /**
   * loginUserController
   * - login with valid data DONE
   * - does not login with wrong password DONE
   * - does not login with wrong email DONE
   * - does not login with missing data DONE
   */
  describe("POST /login", () => {
    it("should return 400 if email or password is missing", async () => {
      const response = await request(app).post("/auth/login").send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email and password are required.");
    });

    it("should return 200 and a token if login is successful", async () => {
      vi.spyOn(postgresDBPool, "connect").mockResolvedValueOnce();
      vi.spyOn(postgresDBPool, "end").mockResolvedValueOnce();
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
      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword234rer",
      });

      expect(response.status).toBe(400);
    });

    it("should handle errors during login", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "testNot@example.com",
        password: "wrongpassword234rer",
      });

      expect(response.status).toBe(400);
    });
  });
});
