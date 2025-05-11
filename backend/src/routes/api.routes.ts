import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getItemsController,
  getInfoController,
  updateItemsController,
  getWordsController,
} from "../controllers/items.controller";
import {
  getGrammarPhrasesController,
  getGrammarsController,
} from "../controllers/blocks.controller";

import { getUserController } from "../controllers/user.controller";

const apiRouter = express.Router();

apiRouter.get("/users", authenticateMiddleware, getUserController); // sends user settings, user score
apiRouter.get("/items", authenticateMiddleware, getItemsController); // sends array of items for practice
apiRouter.patch("/items", authenticateMiddleware, updateItemsController); // updates user items, sends user score
apiRouter.get("/items/:itemId/info", authenticateMiddleware, getInfoController); // sends array of items with info
apiRouter.get("/items/words", authenticateMiddleware, getWordsController); // sends array of started words, with pagination
apiRouter.get("/blocks/grammar", authenticateMiddleware, getGrammarsController); // sends array of started grammar lectures
apiRouter.get(
  "/blocks/grammar/:grammarId",
  authenticateMiddleware,
  getGrammarPhrasesController
); // sends array of phrases connected to given grammarID

export default apiRouter;
