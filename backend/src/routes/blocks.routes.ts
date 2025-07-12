import express from "express";
import { getGrammarListController } from "../controllers/blocks.controller";
import {
  validateLanguageID,
  validateUID,
} from "../middlewares/validation.middleware";

const itemsRouter = express.Router();

itemsRouter.post(
  "/grammar",
  validateUID,
  validateLanguageID,
  getGrammarListController
); // sends list of grammar blocks

export default itemsRouter;
