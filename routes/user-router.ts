import express from 'express';
import UserController from '../controllers/user-controller';

const userRouter = express.Router();

userRouter.get('*', UserController.base);

export default userRouter;
