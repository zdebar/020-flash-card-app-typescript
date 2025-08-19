import express from "express";
import {
  getGrammarListController,
  getGrammarPracticeListController,
  resetBlockController,
} from "../controllers/blocks.controller";
import {
  validateLanguageIDParams,
  validateUID,
  validateBlockID,
} from "../middlewares/validation.middleware";

const itemsRouter = express.Router();

itemsRouter.get(
  "/grammar/:languageID",
  validateUID,
  validateLanguageIDParams,
  getGrammarListController
); // sends list of grammar blocks

itemsRouter.get(
  "/practice/:languageID",
  validateUID,
  validateLanguageIDParams,
  getGrammarPracticeListController
); // sends list of grammar practice blocks

itemsRouter.delete(
  "/:blockID",
  validateUID,
  validateBlockID,
  resetBlockController
); // reset given block

export default itemsRouter;
