import express from "express";
import {
  getItemsController,
  patchItemsController,
  getInfoController,
} from "../controllers/items.controller";
import {
  validateLanguageID,
  validateUID,
  validateItems,
  validateOnBlockEnd,
  validateItemID,
} from "../middlewares/validation.middleware";

const itemsRouter = express.Router();

itemsRouter.post("/", validateUID, validateLanguageID, getItemsController); // sends array of items (words) for practice
itemsRouter.patch(
  "/",
  validateUID,
  validateLanguageID,
  validateOnBlockEnd,
  validateItems,
  patchItemsController
); // updates user items (words), sends user score
itemsRouter.get("/:itemId/info", validateItemID, getInfoController); // sends info relevant to the given item

export default itemsRouter;
