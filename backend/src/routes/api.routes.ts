import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getItemsController,
  getInfoController,
  updateItemsController,
} from "../controllers/practice.controller";
import { getUserController } from "../controllers/user.controller";

const apiRouter = express.Router();

apiRouter.get("/users", authenticateMiddleware, getUserController); // sends user settings and user score
apiRouter.get("/items", authenticateMiddleware, getItemsController); // sends array of items
apiRouter.patch("/items", authenticateMiddleware, updateItemsController); // updates user items, sends user score
apiRouter.get("/info/:itemId", authenticateMiddleware, getInfoController); // sends array of items with info

export default apiRouter;
