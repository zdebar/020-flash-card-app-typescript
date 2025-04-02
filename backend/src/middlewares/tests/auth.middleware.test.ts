import { Request, Response } from "express";
import { authenticateTokenMiddleware } from "../../middlewares/auth.middleware";
import { verifyToken } from "../../utils/auth.utils";
import { describe, it, expect, vi, Mock, afterEach } from "vitest";
import { User } from "../../../../shared/types/dataTypes";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

vi.mock("../../utils/auth.utils");

/**
 * authenticateTokenMiddleware
 * - next if token is valid
 * - 401 if no token is provided
 * - 403 if token is invalid
 */
describe("authenticateTokenMiddleware", () => {
  const mockNext = vi.fn();
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call next if token is valid", () => {
    const mockReq = {
      headers: { authorization: "Bearer validToken" },
      ip: "127.0.0.1",
    } as Request;

    (verifyToken as Mock).mockReturnValue({ id: "123", name: "Test User" });

    authenticateTokenMiddleware(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith("validToken", expect.any(String));
    expect(mockReq.user).toEqual({ id: "123", name: "Test User" });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    const mockReq = {
      headers: {},
      ip: "127.0.0.1",
    } as Request;

    authenticateTokenMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Žádný autentizační token.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 if token is invalid", () => {
    const mockReq = {
      headers: { authorization: "Bearer invalidToken" },
      ip: "127.0.0.1",
    } as Request;

    (verifyToken as Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authenticateTokenMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Autentifikace selhala.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
