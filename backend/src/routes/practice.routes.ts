import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getWordsController,
  updateWordsController,
  insertNoteController,
} from "../controllers/practice.controller";

const practiceRouter = express.Router();

practiceRouter.get("/getWords", authenticate, getWordsController);
practiceRouter.post("/updateWords", authenticate, updateWordsController);
practiceRouter.post("/insertNote", authenticate, insertNoteController);

export default practiceRouter;
