import express from "express";
import {
  getPracticeController,
  patchPracticeController,
  getItemInfoController,
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
  "/:languageId/list",
  validateLanguageIDParams,
  getUserItemsListController
); // sends list of all user_items for the given language

itemsRouter.get(
  "/:languageId/practice",
  validateUID,
  validateLanguageIDParams,
  getPracticeController
); // sends Items[] for practice

itemsRouter.patch(
  "/:languageId/practice",
  validateUID,
  validateLanguageIDParams,
  validateOnBlockEnd,
  validateItems,
  patchPracticeController
); // updates user_items, sends UserScore

itemsRouter.get("/:itemId/info", validateItemID, getItemInfoController); // sends item context info

itemsRouter.delete("/:itemId/reset", validateItemID, resetItemController); // resets progress for the given item

export default itemsRouter;
