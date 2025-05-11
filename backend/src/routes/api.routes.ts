import express from "express";
import usersRouter from "./users.routes";
import itemsRouter from "./items.routes";

const apiRouter = express.Router();

apiRouter.use(usersRouter);
apiRouter.use(itemsRouter);

export default apiRouter;
