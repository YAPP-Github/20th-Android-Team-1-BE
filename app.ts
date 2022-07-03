import express from 'express';
import { useExpressServer } from 'routing-controllers';
import UserController from './controllers/user-controller';
import PromisingController from './controllers/promising-controller';
import db from './models';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { ErrorHandler } from './middlewares/error';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import timeUtil from './utils/time';

const app = express();

const LOGGER = process.env.LOGGER || 'dev';

const swaggerSpec = YAML.load(path.join(__dirname, './swagger/openapi.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan(LOGGER));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

useExpressServer(app, {
  routePrefix: '/api',
  controllers: [UserController, PromisingController],
  defaultErrorHandler: false,
  middlewares: [ErrorHandler]
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

console.log(timeUtil.isPossibleDate(new Date(2019, 1, 11), [new Date(), new Date(2019, 1, 11)]));
