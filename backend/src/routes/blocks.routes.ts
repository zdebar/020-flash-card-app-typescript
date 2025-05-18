import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import { getGrammarListController } from "../controllers/blocks.controller";

const itemsRouter = express.Router();

itemsRouter.get("/grammar", getGrammarListController); // sends list of grammar blocks

export default itemsRouter;
