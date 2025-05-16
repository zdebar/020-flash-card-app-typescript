import express from "express";
import usersRouter from "./users.routes";
import itemsRouter from "./items.routes";
import blocksRouter from "./blocks.routes";

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/items", itemsRouter);
apiRouter.use("/blocks", blocksRouter);

export default apiRouter;
