import UserService from '../service/user-service';

const UserController = {
  async base() {
    await UserService.baseFunc();
  }
};

export default UserController;
