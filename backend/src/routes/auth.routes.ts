import express from "express";
import {
  registerUserController,
  loginUserController,
  getUserProfileController,
} from "../controllers/auth.controller";
import { authenticateTokenMiddleware } from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.get(
  "/getPreferences",
  authenticateTokenMiddleware,
  getUserProfileController
);
authRouter.get("/updatePreferences", authenticateTokenMiddleware); // TODO: implement update preferences

export default authRouter;
