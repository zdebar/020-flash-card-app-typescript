import express from 'express';
import { authenticateTokenMiddleware } from '../middlewares/auth.middleware'; 
import { getUserWordsController, updateUserWordsController, getUserProfileController } from '../controllers/user.controller';
import db from '../config/database.config';

const userRouter = express.Router();

userRouter.get('/', authenticateTokenMiddleware, getUserProfileController(db));
userRouter.get('/words/:userId/:language', authenticateTokenMiddleware, getUserWordsController(db));
userRouter.post('/words/:userId/progress', authenticateTokenMiddleware, updateUserWordsController(db));

export default userRouter;