import express from 'express';
import userRouter from './route/user-router';
import db from './models'
const app = express();

app.use('api/', userRouter);

app.listen(async () => {
    try{
        await db.sequelize.authenticate()
        .then(() => {
            console.log("DB connection success")
        })
        console.log(`server is running on ${process.env.ORIGIN}:${process.env.PORT}`)
    }
    catch (err) {
        console.error(err);
        console.log("Server running failed")
    }
});
console.log('서버가 실행 중입니다...');
