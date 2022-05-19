import express from 'express';
import userRouter from './route/user-router';

const app = express();

app.use('api/', userRouter);
