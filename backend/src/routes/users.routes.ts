import express from "express";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import {
  getUserController,
  patchNotesController,
} from "../controllers/user.controller";

const usersRouter = express.Router();

usersRouter.get("/", authenticateMiddleware, getUserController); // sends user settings, user score
usersRouter.patch("/notes", authenticateMiddleware, patchNotesController); // sends user settings, user score

export default usersRouter;
