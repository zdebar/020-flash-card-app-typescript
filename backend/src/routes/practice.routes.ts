import express from "express";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";
import {
  getUserWordsController,
  updateUserWordsController,
} from "../controllers/practice.controller";

const practiceRouter = express.Router();

practiceRouter.get(
  "/getUserWords",
  authenticateTokenMiddleware,
  getUserWordsController
);
practiceRouter.post(
  "/updateUserWords",
  authenticateTokenMiddleware,
  updateUserWordsController
);

export default practiceRouter;
