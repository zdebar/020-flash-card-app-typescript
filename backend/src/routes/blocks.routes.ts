import express from "express";
import {
  getGrammarListController,
  resetBlockController,
} from "../controllers/blocks.controller";
import {
  validateLanguageIDParams,
  validateUID,
  validateBlockID,
} from "../middlewares/validation.middleware";

const itemsRouter = express.Router();

itemsRouter.get(
  "/:languageID",
  validateUID,
  validateLanguageIDParams,
  getGrammarListController
); // sends list of grammar blocks

itemsRouter.delete(
  "/:blockID",
  validateUID,
  validateBlockID,
  resetBlockController
); // reset given block

export default itemsRouter;
