import express from "express";
import usersRouter from "./users.routes";
import itemsRouter from "./items.routes";
import blocksRouter from "./blocks.routes";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import requestLoggerMiddleware from "../middlewares/requestLogger.middleware";

const apiRouter = express.Router();

// Apply authentication and request logging to all API routes
apiRouter.use(authenticateMiddleware, requestLoggerMiddleware);

apiRouter.use("/users", usersRouter);
apiRouter.use("/items", itemsRouter);
apiRouter.use("/blocks", blocksRouter);

export default apiRouter;
