import bodyParser from 'body-parser';
import db from './models';
import { createExpressServer } from 'routing-controllers';
import { PromisingController } from './controllers/promising-controller';

const app = createExpressServer({
  controllers: [PromisingController],
})
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
