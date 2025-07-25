import express from "express";
import {
  getUserController,
  resetUserLanguageController,
} from "../controllers/user.controller";
import {
  validateUID,
  validateLanguageIDParams,
} from "../middlewares/validation.middleware";

const usersRouter = express.Router();

usersRouter.get("/", validateUID, getUserController); // sends user settings, user score
usersRouter.delete(
  "/language/:languageID",
  validateUID,
  validateLanguageIDParams,
  resetUserLanguageController
); // deletes all user_items for given language and sends back updated score

export default usersRouter;
