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
  "/getPreferences",
  authenticateTokenMiddleware,
  getUserProfileController
);
userRouter.get("/updatePreferences", authenticateTokenMiddleware); // TODO: implement update preferences

export default userRouter;
