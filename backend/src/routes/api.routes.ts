import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
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

apiRouter.get("/users", authenticate, getUserController); // returns user settings and user score
apiRouter.get("/words", authenticate, getWordsController); // returns words for practice
apiRouter.patch("/words", authenticate, updateWordsController); // update words after practice, returns user score
apiRouter.get("/grammar", authenticate, getGrammarController); // returns grammar lecture for practice
apiRouter.patch("/grammar", authenticate, updateGrammarController); // update grammar after practice
apiRouter.get(
  "/pronunciation/list",
  authenticate,
  getPronunciationListController
); // returns list of pronunciation lectures
apiRouter.get("/pronunciation", authenticate, getPronunciationController); // update pronunciation lecture after practice

export default apiRouter;
