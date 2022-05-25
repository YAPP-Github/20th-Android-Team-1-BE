import express from 'express';
import userRouter from './route/user-router';
import db from './models';
const app = express();

app.use('api/', userRouter);

app.listen(async () => {
  try {
    await db.sequelize.authenticate().then(() => {
      console.log('DB connection success');
    });
    console.log('Server is running');
  } catch (err) {
    console.error(err);
    console.log('Server running failed');
  }
});
