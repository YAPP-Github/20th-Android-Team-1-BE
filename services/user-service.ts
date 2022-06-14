import { NotFoundError } from 'routing-controllers';
import User from '../models/user';

class UserService {
  async create(userName: string, accessToken: string, refreshToken: string): Promise<User> {
    const user: User = new User({ userName, accessToken, refreshToken });
    return await user.save();
  }

  async findOneByAccessToken(accessToken: string): Promise<User> {
    const user: User | null = await User.findOne({ where: { accessToken } });
    if (!user) throw new NotFoundError('Requested User Not Found.');
    return user;
  }
}

export default new UserService();
