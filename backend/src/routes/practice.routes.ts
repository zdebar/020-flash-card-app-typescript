import express from "express";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";
import {
  getWordsController,
  updateWordsController,
  insertNoteController,
} from "../controllers/practice.controller";

const practiceRouter = express.Router();

practiceRouter.get(
  "/getWords",
  authenticateTokenMiddleware,
  getWordsController
);
practiceRouter.post(
  "/updateWords",
  authenticateTokenMiddleware,
  updateWordsController
);
practiceRouter.post(
  "/insertNote",
  authenticateTokenMiddleware,
  insertNoteController
);

export default practiceRouter;
