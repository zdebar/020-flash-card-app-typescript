import express from "express";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";
import {
  getWordsController,
  updateWordsController,
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

export default practiceRouter;
