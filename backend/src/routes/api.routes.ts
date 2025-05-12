import express from "express";
import usersRouter from "./users.routes";
import itemsRouter from "./items.routes";

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/items", itemsRouter);

export default apiRouter;
