import express from "express";
import {
  getUserController,
  resetUserLanguageController,
} from "../controllers/user.controller";

const usersRouter = express.Router();

usersRouter.get("/", getUserController); // sends user settings, user score
usersRouter.post("/resetLanguage", resetUserLanguageController); // resets user language items and sends updated score

export default usersRouter;
