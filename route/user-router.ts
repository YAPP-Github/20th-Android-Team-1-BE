import express from 'express';
import UserController from '../controller/user-controller';

const userRouter = express.Router();

userRouter.get('/', UserController.base);
