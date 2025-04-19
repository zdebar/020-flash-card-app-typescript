import express from "express";
import {
  registerUserController,
  loginUserController,
  getUserController,
  updateUserController,
  refreshTokenController,
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
userRouter.post("/refresh-token", refreshTokenController);

export default userRouter;
