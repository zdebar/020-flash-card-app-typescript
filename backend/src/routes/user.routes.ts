import express from 'express';
import { authenticateTokenMiddleware } from '../middlewares/auth.middleware'; 
import { getUserWordsController, updateUserWordsController, getUserProfileController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/', authenticateTokenMiddleware, getUserProfileController);
userRouter.get('/words/:userId/:language', authenticateTokenMiddleware, getUserWordsController);
userRouter.post('/words/:userId/progress', authenticateTokenMiddleware, updateUserWordsController);

export default userRouter;