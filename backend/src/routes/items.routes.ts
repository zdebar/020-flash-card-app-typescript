import express from "express";
import {
  getItemsController,
  patchItemsController,
  getInfoController,
} from "../controllers/items.controller";

const itemsRouter = express.Router();

itemsRouter.get("/", getItemsController); // sends array of items (words) for practice
itemsRouter.patch("/", patchItemsController); // updates user items (words), sends user score
itemsRouter.get("/:itemId/info", getInfoController); // sends info relevant to the given item

export default itemsRouter;
