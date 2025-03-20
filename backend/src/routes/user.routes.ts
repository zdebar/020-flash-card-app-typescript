import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware'; 
import { getUserProfile } from '../controllers/auth.controller'; 
import { getUserWordsController, updateUserWordsController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/user', authenticateToken, getUserProfile);
userRouter.get('/words/:userId/:language', authenticateToken, getUserWordsController);
userRouter.post('/words/:userId/progress', authenticateToken, updateUserWordsController);

export default userRouter;