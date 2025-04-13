import express from "express";
import {
  registerUserController,
  loginUserController,
  getUserProfileController,
} from "../controllers/user.controller";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.get(
  // TODO: do I need this, is already done with login
  "getUser",
  authenticateTokenMiddleware,
  getUserProfileController
);
userRouter.get("/updateUser", authenticateTokenMiddleware); // TODO: implement update preferences

export default userRouter;
