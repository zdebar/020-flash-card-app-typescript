import express from "express";
import {
  getItemsController,
  patchItemsController,
  getInfoController,
  getUserItemsListController,
  resetItemController,
} from "../controllers/items.controller";
import {
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
  "/:languageID/practice",
  validateUID,
  validateLanguageIDParams,
  validateOnBlockEnd,
  validateItems,
  patchItemsController
); // updates user items (words), sends user score

itemsRouter.get("/:itemID/info", validateItemID, getInfoController); // sends info relevant to the given item

itemsRouter.delete("/:itemID/reset", validateItemID, resetItemController); // resets progres for the given item

itemsRouter.get(
  "/:languageID/list",
  validateLanguageIDParams,
  getUserItemsListController
); // sends grammar info for the given item

export default itemsRouter;
