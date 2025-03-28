import { describe, it, expect, vi, Mock } from "vitest";
import { registerUserController, loginUserController } from "../controllers/auth.controller";
import { registerUserService, loginUserService } from "../services/user.service";
import { Request, Response } from "express";
import sqlite3 from "sqlite3";

// Mock the services
vi.mock("../services/auth.service");

describe("User Controller Tests", () => {
  const mockDb = {} as sqlite3.Database;
  
  describe("registerUserController", () => {
    it("should return 400 if missing fields", async () => {
      const mockReq = {
        body: { username: "", email: "", password: "" },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const controller = registerUserController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "All fields are required." });
    });

    it("should call registerUserService and return 201 on success", async () => {
      const mockReq = {
        body: { username: "testuser", email: "test@example.com", password: "password123" },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock the registerUserService
      (registerUserService as Mock).mockResolvedValue("User registered successfully");

      const controller = registerUserController(mockDb);
      await controller(mockReq, mockRes);

      expect(registerUserService).toHaveBeenCalledWith(mockDb, "testuser", "test@example.com", "password123");
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User registered successfully" });
    });

    it("should return 400 if registerUserService fails", async () => {
      const mockReq = {
        body: { username: "testuser", email: "test@example.com", password: "password123" },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock the registerUserService to throw an error
      (registerUserService as Mock).mockRejectedValue(new Error("Registration failed"));

      const controller = registerUserController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Registration failed" });
    });
  });

  describe("loginUserController", () => {
    it("should return 400 if missing email or password", async () => {
      const mockReq = {
        body: { email: "", password: "" },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const controller = loginUserController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Email and password are required." });
    });

    it("should call loginUserService and return token on success", async () => {
      const mockReq = {
        body: { email: "test@example.com", password: "password123" },
      } as Request;
      const mockRes = {
        json: vi.fn(),
      } as unknown as Response;

      // Mock the loginUserService to return a token
      (loginUserService as Mock).mockResolvedValue("sampleToken123");

      const controller = loginUserController(mockDb);
      await controller(mockReq, mockRes);

      expect(loginUserService).toHaveBeenCalledWith(mockDb, "test@example.com", "password123");
      expect(mockRes.json).toHaveBeenCalledWith({ token: "sampleToken123" });
    });

    it("should return 401 if loginUserService fails", async () => {
      const mockReq = {
        body: { email: "test@example.com", password: "password123" },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock the loginUserService to throw an error
      (loginUserService as Mock).mockRejectedValue(new Error("Invalid email or password"));

      const controller = loginUserController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid email or password" });
    });
  });
});
