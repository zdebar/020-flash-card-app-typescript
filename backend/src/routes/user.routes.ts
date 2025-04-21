import express from "express";
import {
  getUserController,
  updateUserController,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.get("/getUser", authenticate, getUserController);
userRouter.get("/updateUser", authenticate, updateUserController);

export default userRouter;
