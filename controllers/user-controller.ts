import UserService from '../services/user-service';

const UserController = {
  async base(req: any, res: any) {
    await UserService.baseFunc();
    res.json('success');
  }
};

export default UserController;
