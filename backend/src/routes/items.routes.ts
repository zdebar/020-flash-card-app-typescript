import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getItemsController,
  patchItemsController,
  getInfoController,
} from "../controllers/items.controller";

const itemsRouter = express.Router();

itemsRouter.get("/", authenticateMiddleware, getItemsController); // sends array of items for practice
itemsRouter.patch("/", authenticateMiddleware, patchItemsController); // updates user items, sends user score
itemsRouter.get("/:itemId/info", authenticateMiddleware, getInfoController); // sends array of items with info

export default itemsRouter;
