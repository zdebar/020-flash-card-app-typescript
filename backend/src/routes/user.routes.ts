import express from "express";
import {
  registerUserController,
  loginUserController,
  getUserController,
  updateUserController,
} from "../controllers/user.controller";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.get("/getUser", authenticateTokenMiddleware, getUserController);
// userRouter.get(
//   "/updateUser",
//   authenticateTokenMiddleware,
//   updateUserController
// );

export default userRouter;
