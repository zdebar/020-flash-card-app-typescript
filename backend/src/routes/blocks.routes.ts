import express from "express";
import {
  getGrammarListController,
  resetBlockController,
} from "../controllers/blocks.controller";
import {
  validateLanguageIDBody,
  validateUID,
  validateBlockID,
} from "../middlewares/validation.middleware";

const itemsRouter = express.Router();

itemsRouter.post(
  "/grammar",
  validateUID,
  validateLanguageIDBody,
  getGrammarListController
); // sends list of grammar blocks

itemsRouter.delete(
  "/:blockID",
  validateUID,
  validateBlockID,
  resetBlockController
); // reset given block

export default itemsRouter;
