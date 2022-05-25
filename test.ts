import db from './models';
import PromiseModel from './models/Promise';
import UserModel from './models/user';

db.sequelize.sync();

const testFunc = async () => {
  const user = await UserModel.create({ userName: 'Min Subin' });
  const promise = await PromiseModel.create({
    promiseName: 'New promise',
    startDate: new Date(),
    endDate: new Date()
  });
  console.log(user.userName);
  console.log(user.id);
  console.log(promise.promiseName);
};

export default testFunc;
