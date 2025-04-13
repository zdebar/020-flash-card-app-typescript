import logger from "../utils/logger.utils";
import { Request, Response, NextFunction } from "express";

// Request logger middleware
export default function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { method, url } = req;
  const startTime = Date.now();

  // Log the request details
  logger.info(`Incoming request: ${method} ${url}`);

  // Log the response details after the request is handled
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.info(
      `Response: ${method} ${url} ${res.statusCode} - ${responseTime}ms`
    );
  });

  next();
}
