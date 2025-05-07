import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getItemsController,
  getInfoController,
  updateItemsController,
} from "../controllers/practice.controller";
import {
  getOverviewWordsController,
  getOverviewSentencesController,
  getOverviewGrammarController,
} from "../controllers/overview.controller";
import { getUserController } from "../controllers/user.controller";

const apiRouter = express.Router();

apiRouter.get("/users", authenticateMiddleware, getUserController); // sends user settings and user score
apiRouter.get("/items", authenticateMiddleware, getItemsController); // sends array of items
apiRouter.patch("/items", authenticateMiddleware, updateItemsController); // updates user items, sends user score
apiRouter.get("/items/:itemId/info", authenticateMiddleware, getInfoController); // sends array of items with info
apiRouter.get(
  "/progress/words",
  authenticateMiddleware,
  getOverviewWordsController
); // sends array of words with progress
apiRouter.get(
  "/progress/sentences",
  authenticateMiddleware,
  getOverviewSentencesController
); // sends array of sentences with progress
apiRouter.get(
  "/progress/grammar",
  authenticateMiddleware,
  getOverviewGrammarController
); // sends array of grammar with progress

export default apiRouter;
