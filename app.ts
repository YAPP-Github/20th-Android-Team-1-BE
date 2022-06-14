import express from 'express';
import { useExpressServer } from 'routing-controllers';
import UserController from './controllers/user-controller';
import { PromisingController } from './controllers/promising-controller';
import db from './models';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

useExpressServer(app, {
  routePrefix: '/api',
  controllers: [UserController,PromisingController]
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  await db.sequelize.sync();

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
