import express from "express";
import {
  getItemsController,
  patchItemsController,
  getInfoController,
} from "../controllers/items.controller";
import {
  validateLanguageIDBody,
  validateLanguageIDParams,
  validateUID,
  validateItems,
  validateOnBlockEnd,
  validateItemID,
} from "../middlewares/validation.middleware";

const itemsRouter = express.Router();

itemsRouter.get(
  "/:languageID/practice",
  validateUID,
  validateLanguageIDParams,
  getItemsController
); // sends array of items (words) for practice
itemsRouter.patch(
  "/",
  validateUID,
  validateLanguageIDBody,
  validateOnBlockEnd,
  validateItems,
  patchItemsController
); // updates user items (words), sends user score
itemsRouter.get("/:itemID/info", validateItemID, getInfoController); // sends info relevant to the given item

export default itemsRouter;
