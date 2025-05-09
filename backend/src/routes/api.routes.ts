import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getItemsController,
  getInfoController,
  updateItemsController,
} from "../controllers/practice.controller";
import {
  getOverviewWordsController,
  getOverviewGrammarController,
} from "../controllers/overview.controller";
import { getUserController } from "../controllers/user.controller";

const apiRouter = express.Router();

apiRouter.get("/users", authenticateMiddleware, getUserController); // sends user settings, user score
apiRouter.get("/items", authenticateMiddleware, getItemsController); // sends array of items for practice
apiRouter.patch("/items", authenticateMiddleware, updateItemsController); // updates user items, sends user score
apiRouter.get("/items/:itemId/info", authenticateMiddleware, getInfoController); // sends info about item (contextutal info - grammar, pronunciation, similar sounding words, words with same pronunciation)
apiRouter.get(
  "/overview/vocabulary",
  authenticateMiddleware,
  getOverviewWordsController
); // sends all started words, paginated
apiRouter.get(
  "/overview/grammar",
  authenticateMiddleware,
  getOverviewGrammarController
); // sends list of grammar, paginated
apiRouter.get(
  "/overview/grammar/:grammarId",
  authenticateMiddleware,
  getOverviewGrammarController
); // TODO: write explanation

export default apiRouter;
