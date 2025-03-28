import { Request, Response } from "express";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";
import { verifyToken } from "../utils/auth.utils"; 
import { describe, it, expect, vi, Mock } from "vitest";
import { UserLogin } from "../types/dataTypes";

declare global {
  namespace Express {
    interface Request {
      user?: UserLogin; 
    }
  }
}

vi.mock("../utils/auth.utils"); 

describe("authenticateTokenMiddleware", () => {
  const mockNext = vi.fn();
  const mockRes = {} as Response;

  it("should respond with 401 if no token is provided", async () => {
    const mockReq = {
      headers: {}, 
    } as Request;

    const res = {
      ...mockRes,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await authenticateTokenMiddleware(mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No authentication token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should respond with 403 if token is invalid", async () => {
    const mockReq = {
      headers: { authorization: "Bearer invalidToken" }, 
    } as Request;

    (verifyToken as Mock).mockRejectedValue(new Error("Invalid token"));

    const res = {
      ...mockRes,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await authenticateTokenMiddleware(mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Authentication failed" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() if the token is valid", async () => {
    const mockReq = {
      headers: { authorization: "Bearer validToken" }, // Valid token
    } as Request;

    (verifyToken as Mock).mockResolvedValue({ userId: 1, username: "testUser" });

    const res = {} as Response;

    await authenticateTokenMiddleware(mockReq, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual({ userId: 1, username: "testUser" });
  });
});
