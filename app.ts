import express from 'express';
import userRouter from './route/user-router';

const app = express();

app.use('api/', userRouter);

app.listen();

console.log('서버가 실행 중입니다...');
