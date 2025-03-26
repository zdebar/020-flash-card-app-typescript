import { describe, it, expect, vi, Mock } from "vitest";
import { getUserWordsController, updateUserWordsController, getUserProfileController } from "../controllers/user.controller";
import { getUserWords, updateUserWords } from "../services/word.service.sqlite";
import { findUserById } from "../repository/user.repository";
import { Request, Response } from "express";
import sqlite3 from "sqlite3";

// Mock the services and repositories
vi.mock("../services/word.service");
vi.mock("../repository/user.repository");

describe("Word Controller Tests", () => {
  const mockDb = {} as sqlite3.Database;

  describe("getUserWordsController", () => {
    it("should return 400 if language or block is missing", async () => {
      const mockReq = {
        query: {},
        user: { id: 1 },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const controller = getUserWordsController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Language and block are required." });
    });

    it("should return 400 if block number is invalid", async () => {
      const mockReq = {
        query: { language: "en", block: "1" },
        user: { id: 1 },
      } as unknown as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const controller = getUserWordsController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid block number." });
    });

    it("should return 200 with words on success", async () => {
      const mockReq = {
        query: { language: "en", block: "1" },
        user: { id: 1 },
      } as unknown as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock the getUserWords service
      (getUserWords as Mock).mockResolvedValue([{ word: "hello" }]);

      const controller = getUserWordsController(mockDb);
      await controller(mockReq, mockRes);

      expect(getUserWords).toHaveBeenCalledWith(mockDb, 1, "en", 1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([{ word: "hello" }]);
    });

    it("should return 500 on error", async () => {
      const mockReq = {
        query: { language: "en", block: "1" },
        user: { id: 1 },
      } as unknown as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock an error in getUserWords service
      (getUserWords as Mock).mockRejectedValue(new Error("Database error"));

      const controller = getUserWordsController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("updateUserWordsController", () => {
    it("should return 400 if words or SRS are not arrays", async () => {
      const mockReq = {
        body: { words: {}, SRS: {} },
        user: { id: 1 },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const controller = updateUserWordsController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Words and SRS must be arrays." });
    });

    it("should return 200 with success message", async () => {
      const mockReq = {
        body: { words: ["word1", "word2"], SRS: [1, 2] },
        user: { id: 1 },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock the updateUserWords service
      (updateUserWords as Mock).mockResolvedValue(undefined);

      const controller = updateUserWordsController(mockDb);
      await controller(mockReq, mockRes);

      expect(updateUserWords).toHaveBeenCalledWith(mockDb, 1, ["word1", "word2"], [1, 2]);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User words updated successfully." });
    });

    it("should return 500 on error", async () => {
      const mockReq = {
        body: { words: ["word1", "word2"], SRS: [1, 2] },
        user: { id: 1 },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock an error in updateUserWords service
      (updateUserWords as Mock).mockRejectedValue(new Error("Update failed"));

      const controller = updateUserWordsController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getUserProfileController", () => {
    it("should return 404 if user is not found", async () => {
      const mockReq = {
        user: { id: 1 },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock the findUserById repository
      (findUserById as Mock).mockResolvedValue(null);

      const controller = getUserProfileController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 200 with user data", async () => {
      const mockReq = {
        user: { id: 1 },
      } as Request;
      const mockRes = {
        json: vi.fn(),
      } as unknown as Response;

      const mockUser = { id: 1, username: "testuser", email: "test@example.com" };

      // Mock the findUserById repository
      (findUserById as Mock).mockResolvedValue(mockUser);

      const controller = getUserProfileController(mockDb);
      await controller(mockReq, mockRes);

      expect(findUserById).toHaveBeenCalledWith(mockDb, 1);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 500 on error", async () => {
      const mockReq = {
        user: { id: 1 },
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock an error in findUserById repository
      (findUserById as Mock).mockRejectedValue(new Error("Database error"));

      const controller = getUserProfileController(mockDb);
      await controller(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
