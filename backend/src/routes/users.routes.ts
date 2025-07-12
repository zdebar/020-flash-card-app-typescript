import express from "express";
import {
  getUserController,
  resetUserLanguageController,
} from "../controllers/user.controller";

const usersRouter = express.Router();

usersRouter.get("/", getUserController); // sends user settings, user score
usersRouter.delete("/reset-language", resetUserLanguageController); // deletes user language items and sends back updated score

export default usersRouter;
