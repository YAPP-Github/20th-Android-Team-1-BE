import UserService from '../services/user-service';

const UserController = {
  async base() {
    await UserService.baseFunc();
  }
};

export default UserController;
