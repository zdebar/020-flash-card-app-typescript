import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import {
  getWordsController,
  updateWordsController,
  getUserProfileController,
} from "../practice.controller";
import { Request, Response } from "express";
import db from "../../config/database.config.postgres";
import * as wordService from "../../repository/practice.repository.postgres";
import * as userService from "../../services/user.service";
import { closeDbConnection } from "../../utils/database.utils";

vi.mock("../../config/database.config.postgres");
vi.mock("../../repository/word.service.postgres");
vi.mock("../../services/user.service");
vi.mock("../../utils/database.utils");

describe("User Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: Mock;
  let statusMock: Mock;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));
    req = {
      user: { id: 1, email: "test@example.cz", username: "test" },
      query: {},
      body: {},
    };
    res = { status: statusMock, json: jsonMock };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserWordsController", () => {
    it("should handle errors and call handleControllerError", async () => {
      const mockError = new Error("Database error");
      vi.spyOn(wordService, "getWordsPostgres").mockRejectedValue(mockError);

      await getWordsController(req as Request, res as Response);

      expect(res.status).not.toHaveBeenCalledWith(200);
      expect(closeDbConnection).toHaveBeenCalledWith(db);
    });
  });

  describe("updateUserWordsController", () => {
    it("should update user words and return 200", async () => {
      req.body = { words: [{ id: 1, word: "updated" }] };

      await updateWordsController(req as Request, res as Response);

      expect(db.connect).toHaveBeenCalled();
      expect(wordService.updateWords).toHaveBeenCalledWith(
        db,
        1,
        req.body.words
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User words updated successfully.",
      });
      expect(closeDbConnection).toHaveBeenCalledWith(db);
    });

    it("should handle errors and call handleControllerError", async () => {
      const mockError = new Error("Update error");
      vi.spyOn(wordService, "updateWordsPostgres").mockRejectedValue(mockError);

      await updateWordsController(req as Request, res as Response);

      expect(res.status).not.toHaveBeenCalledWith(200);
      expect(closeDbConnection).toHaveBeenCalledWith(db);
    });
  });

  describe("getUserProfileController", () => {
    it("should retrieve user profile preferences and return 200", async () => {
      const mockPreferences = {
        id: 1,
        username: "test",
        email: "test",
        mode_day: 1,
        font_size: 2,
        notifications: 1,
      };
      vi.spyOn(userService, "getUserPreferences").mockResolvedValue(
        mockPreferences
      );

      await getUserProfileController(req as Request, res as Response);

      expect(db.connect).toHaveBeenCalled();
      expect(userService.getUserService).toHaveBeenCalledWith(db, 1);
      expect(res.json).toHaveBeenCalledWith(mockPreferences);
      expect(closeDbConnection).toHaveBeenCalledWith(db);
    });
  });
});
