import logger from "../utils/logger.utils";
import { Request, Response, NextFunction } from "express";

// Request logger middleware
export default function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { method, url } = req;
  const startTime = Date.now();
  const clientIp = req.ip;

  // Log the request details
  logger.info(`Incoming request: ${method} ${url} from ${clientIp}`);

  // Log the response details after the request is handled
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    const contentLength = res.get("Content-Length") || "0";
    logger.info(
      `Response: ${method} ${url} ${res.statusCode} - ${responseTime}ms - ${contentLength} bytes`
    );
  });

  next();
}
