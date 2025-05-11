import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getItemsController,
  patchItemsController,
  getInfoController,
} from "../controllers/items.controller";

const itemsRouter = express.Router();

itemsRouter.get("/items", authenticateMiddleware, getItemsController); // sends array of items for practice
itemsRouter.patch("/items", authenticateMiddleware, patchItemsController); // updates user items, sends user score
itemsRouter.get(
  "/items/:itemId/info",
  authenticateMiddleware,
  getInfoController
); // sends array of items with info

export default itemsRouter;
