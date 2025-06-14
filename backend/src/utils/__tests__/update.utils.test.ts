import { describe, it, expect, vi } from "vitest";
import {
  getNextAt,
  getLearnedAt,
  getMasteredAt,
  addAudioPath,
} from "../update.utils";
import config from "../../config/config";

vi.mock("../../config/config", () => ({
  default: {
    SRS: [0, 86400, 172800],
    srsRandomness: 0.1,
    learnedProgress: 2,
  },
}));

describe("update.utils", () => {
  describe("getNextAt", () => {
    it("should return a valid ISO string for the next review date", () => {
      const progress = 1;
      const result = getNextAt(progress);
      expect(new Date(result).toISOString()).toBe(result);
    });

    it("should handle invalid progress gracefully", () => {
      const progress = 999;
      const result = getNextAt(progress);
      expect(new Date(result).toISOString()).toBe(result);
    });
  });

  describe("getLearnedAt", () => {
    it("should return a valid ISO string if progress meets the learned threshold", () => {
      const progress = 2;
      const result = getLearnedAt(progress);
      expect(result).not.toBeNull();
      expect(new Date(result!).toISOString()).toBe(result);
    });

    it("should return null if progress does not meet the learned threshold", () => {
      const progress = 1;
      const result = getLearnedAt(progress);
      expect(result).toBeNull();
    });
  });

  describe("getMasteredAt", () => {
    it("should return a valid ISO string if progress meets the mastered threshold", () => {
      const progress = 3;
      const result = getMasteredAt(progress);
      expect(result).not.toBeNull();
      expect(new Date(result!).toISOString()).toBe(result);
    });

    it("should return null if progress does not meet the mastered threshold", () => {
      const progress = 1;
      const result = getMasteredAt(progress);
      expect(result).toBeNull();
    });
  });

  describe("addAudioPath", () => {
    it("should append .opus to the audio string if audio is provided", () => {
      const audio = "example-audio";
      const result = addAudioPath(audio);
      expect(result).toBe("example-audio.opus");
    });

    it("should return null if audio is null", () => {
      const audio = null;
      const result = addAudioPath(audio);
      expect(result).toBeNull();
    });
  });
});
