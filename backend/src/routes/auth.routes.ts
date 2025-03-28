import express from "express";
import { registerUserController, loginUserController } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginUserController);

export default authRoutes;
