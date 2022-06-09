import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/user-router';
import promisingRouter from './routes/promising-router';
import db from './models';

const app = express();
app.use(bodyParser.json())
app.use('/api', userRouter);
app.use('/promisings', promisingRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate().then(() => {
      console.log('✅ MySQL Database connection is successful');
    });
    console.log(`✅ Express Server Listening on : http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    console.log('❎ Express Server Running failed');
  }
});
