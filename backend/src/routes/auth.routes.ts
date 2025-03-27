import express from "express";
import { registerUserController, loginUserController } from "../controllers/auth.controller";
import db from "../config/database.config.sqlite";

const authRoutes = express.Router();

authRoutes.post("/register", registerUserController(db));
authRoutes.post("/login", loginUserController(db));

export default authRoutes;
