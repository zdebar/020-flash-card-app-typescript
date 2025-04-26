import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getWordsController,
  updateWordsController,
  insertNoteController,
} from "../controllers/practice.controller";
import {
  getUserController,
  updateUserController,
} from "../controllers/user.controller";

const apiRouter = express.Router();

apiRouter.get("/users", authenticate, getUserController); // returns user settings and user score
apiRouter.put("/users", authenticate, updateUserController); // post user settings
apiRouter.get("/words", authenticate, getWordsController); // returns words for practice
apiRouter.patch("/words", authenticate, updateWordsController); // update words after practice, returns user score
apiRouter.post("/notes", authenticate, insertNoteController); // post notes for developers

export default apiRouter;
