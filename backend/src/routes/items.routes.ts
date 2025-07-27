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
  "/:languageID/list",
  validateLanguageIDParams,
  getUserItemsListController
); // sends list of all user_items for the given language

itemsRouter.get(
  "/:languageID/practice",
  validateUID,
  validateLanguageIDParams,
  getItemsController
); // sends Items[] for practice

itemsRouter.patch(
  "/:languageID/practice",
  validateUID,
  validateLanguageIDParams,
  validateOnBlockEnd,
  validateItems,
  patchItemsController
); // updates user_items, sends UserScore

itemsRouter.get("/:itemID/info", validateItemID, getInfoController); // sends item context info

itemsRouter.delete("/:itemID/reset", validateItemID, resetItemController); // resets progress for the given item

export default itemsRouter;
