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

apiRouter.get("/users", authenticate, getUserController);
apiRouter.post("/users", authenticate, updateUserController);
apiRouter.get("/words", authenticate, getWordsController);
apiRouter.post("/words", authenticate, updateWordsController);
apiRouter.post("/notes", authenticate, insertNoteController);

export default apiRouter;
