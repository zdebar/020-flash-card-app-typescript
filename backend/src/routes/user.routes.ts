import express from "express";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";
import {
  getUserWordsController,
  updateUserWordsController,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get(
  "/getUserWords",
  authenticateTokenMiddleware,
  getUserWordsController
);
userRouter.post(
  "/updateUserWords",
  authenticateTokenMiddleware,
  updateUserWordsController
);

export default userRouter;
