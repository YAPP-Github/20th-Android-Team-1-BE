import User from '../models/user';

class UserService {
  async create(userName: string, accessToken: string, refreshToken: string): Promise<User> {
    const user: User = new User({ userName, accessToken, refreshToken });
    return await user.save();
  }
}

export default UserService;
