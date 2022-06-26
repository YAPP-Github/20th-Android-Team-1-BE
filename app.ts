import express from 'express';
import { useExpressServer } from 'routing-controllers';
import UserController from './controllers/user-controller';
import PromisingController from './controllers/promising-controller';
import db from './models';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { ErrorHandler } from './middlewares/error';
import { getMetadataArgsStorage } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import * as swaggerUi from "swagger-ui-express";


const app = express();

const LOGGER = process.env.LOGGER || 'dev';
const schemas = validationMetadatasToSchemas({
  refPointerPrefix: '/components/schemas/',
})
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, {}, {
  components: { schemas },
  info: { title: 'growthAPI', version: '1.0.0' },
})
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
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
