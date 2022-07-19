import express from 'express';
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import UserController from './controllers/user-controller';
import PromisingController from './controllers/promising-controller';
import PromiseController from './controllers/promise-controller';
import db from './models';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { ErrorHandler } from './middlewares/error';
import * as swaggerUi from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import redisConfig from './config/redis-config.json';
import { createClient } from 'redis';

const app = express();

const LOGGER = process.env.LOGGER || 'dev';
const PORT = process.env.PORT || 8080;

app.use(morgan(LOGGER));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

export const redisClient = createClient({
  socket: {
    host: redisConfig.development.host,
    port: 6379
  },
  legacyMode: true
});

const routingControllerOptions = {
  routePrefix: '/api',
  controllers: [UserController, PromisingController, PromiseController],
  defaultErrorHandler: false,
  middlewares: [ErrorHandler]
};

useExpressServer(app, routingControllerOptions);

const schemas = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/'
});

const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routingControllerOptions, {
  components: {
    schemas,
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' }
    }
  },
  info: {
    description: '`PLANZ` API Document',
    title: 'API Docs',
    version: '1.0.0'
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
app.listen(PORT, async () => {
  await db.sequelize.sync();

  try {
    await redisClient.connect();
    console.log('✅ Redis connection is successful');
  } catch (err) {
    console.log(err);
    console.log('❎ Redis Running failed');
  }

  try {
    await db.sequelize.authenticate();
    console.log('✅ MySQL Database connection is successful');
    console.log(`✅ Express Server Listening on : http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    console.log('❎ Express Server Running failed');
  }
});
