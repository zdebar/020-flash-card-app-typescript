import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getWordsController,
  updateWordsController,
} from "../controllers/practice.controller";
import { getUserController } from "../controllers/user.controller";

const apiRouter = express.Router();

apiRouter.get("/users", authenticate, getUserController); // returns user settings and user score
apiRouter.get("/words", authenticate, getWordsController); // returns words for practice
apiRouter.patch("/words", authenticate, updateWordsController); // update words after practice, returns user score

export default apiRouter;
