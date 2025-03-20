import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware'; 
import { getUserWordsController, updateUserWordsController, getUserProfileController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/user', authenticateToken, getUserProfileController);
userRouter.get('/words/:userId/:language', authenticateToken, getUserWordsController);
userRouter.post('/words/:userId/progress', authenticateToken, updateUserWordsController);

export default userRouter;