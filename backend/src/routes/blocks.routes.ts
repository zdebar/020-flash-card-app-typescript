import express from "express";
import { getGrammarListController } from "../controllers/blocks.controller";
import { validateLanguageID } from "../middlewares/validation.middleware";

const itemsRouter = express.Router();

itemsRouter.post("/grammar", validateLanguageID, getGrammarListController); // sends list of grammar blocks

export default itemsRouter;
