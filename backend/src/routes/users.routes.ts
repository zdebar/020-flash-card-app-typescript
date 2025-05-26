import express from "express";
import { getUserController } from "../controllers/user.controller";

const usersRouter = express.Router();

usersRouter.get("/", getUserController); // sends user settings, user score

export default usersRouter;
