import express from "express";
import {
  getUserController,
  resetUserLanguageController,
} from "../controllers/user.controller";
import {
  validateUID,
  validateLanguageID,
} from "../middlewares/validation.middleware";

const usersRouter = express.Router();

usersRouter.get("/", validateUID, getUserController); // sends user settings, user score
usersRouter.delete(
  "/reset-language",
  validateUID,
  validateLanguageID,
  resetUserLanguageController
); // deletes user language items and sends back updated score

export default usersRouter;
