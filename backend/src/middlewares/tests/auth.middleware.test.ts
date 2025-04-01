import { Request, Response } from "express";
import { authenticateTokenMiddleware } from "../../middlewares/auth.middleware";
import { verifyToken } from "../../utils/auth.utils";
import { describe, it, expect, vi, Mock } from "vitest";
import { User } from "../../types/dataTypes";

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
 * - 500 if JWT_SECRET is not defined in the configuration
 */
describe("authenticateTokenMiddleware", () => {
  const mockNext = vi.fn();
  const mockRes = {} as Response;

  it("should respond with 401 if no token is provided", () => {
    const mockReq = {
      headers: {},
    } as Request;

    const res = {
      ...mockRes,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    authenticateTokenMiddleware(mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No authentication token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should respond with 403 if token is invalid", () => {
    const mockReq = {
      headers: { authorization: "Bearer invalidToken" },
    } as Request;

    const res = {
      ...mockRes,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    authenticateTokenMiddleware(mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Authentication failed" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() if the token is valid", () => {
    const mockReq = {
      headers: { authorization: "Bearer validToken" },
    } as Request;

    (verifyToken as Mock).mockReturnValue({
      userId: 1,
      username: "testUser",
      email: "test@example.cz",
    });

    const res = {
      ...mockRes,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    authenticateTokenMiddleware(mockReq, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual({
      userId: 1,
      username: "testUser",
      email: "test@example.cz",
    });
  });
});
