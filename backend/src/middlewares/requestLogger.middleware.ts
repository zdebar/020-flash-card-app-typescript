import logger from "../utils/logger.utils";
import { Request, Response, NextFunction } from "express";

/**
 * Request logger middleware to log incoming requests and their responses.
 */
export default function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { method, url } = req;
  const startTime = Date.now();
  const clientIp = req.ip;

  // Try to get user identification from req.user
  let userId = undefined;
  if ((req as any).user) {
    const user = (req as any).user;
    userId = user.name || user.email || user.uid || undefined;
  }

  // Log the request details
  logger.info(
    `Incoming request: ${method} ${url} from ${clientIp}` +
      (userId ? ` by user: ${userId}` : "")
  );

  // Log the response details after the request is handled
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    const contentLength = res.get("Content-Length") || "0";
    logger.info(
      `Response: ${method} ${url} ${res.statusCode} - ${responseTime}ms - ${contentLength} bytes` +
        (userId ? ` for user: ${userId}` : "")
    );
  });

  next();
}
