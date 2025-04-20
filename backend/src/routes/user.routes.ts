import express from "express";
import {
  getUserProfileController,
  updateUserController,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.get("/getUser", authenticate, getUserProfileController);
userRouter.get("/updateUser", authenticate, updateUserController);

export default userRouter;
