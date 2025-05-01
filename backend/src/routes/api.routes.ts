import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getWordsController,
  updateWordsController,
  getGrammarController,
  updateGrammarController,
  getPronunciationListController,
  getPronunciationController,
} from "../controllers/practice.controller";
import { getUserController } from "../controllers/user.controller";

const apiRouter = express.Router();

apiRouter.get("/users", authenticateMiddleware, getUserController); // sends user settings and user score
apiRouter.get("/words", authenticateMiddleware, getWordsController); // sends words
apiRouter.patch("/words", authenticateMiddleware, updateWordsController); // updates user words, sends user score
apiRouter.get("/grammar", authenticateMiddleware, getGrammarController); // sends grammar lecture
apiRouter.patch("/grammar", authenticateMiddleware, updateGrammarController); // updates user grammar
apiRouter.get(
  "/pronunciation/list",
  authenticateMiddleware,
  getPronunciationListController
); // sends list of pronunciation lectures
apiRouter.get(
  "/pronunciation",
  authenticateMiddleware,
  getPronunciationController
); // sends pronunciation lecture

export default apiRouter;
