import { NotFoundError } from 'routing-controllers';
import User from '../models/user';

class UserService {
  async create(userName: string, accessToken: string): Promise<User> {
    const user: User = new User({ userName, accessToken });
    return await user.save();
  }

  async updateTokenIfDiff(id: number, tokenToUpdate: string): Promise<User> {
    const user = await this.findOneById(id);

    if (user.accessToken != tokenToUpdate) {
      return await user.update({ accessToken: tokenToUpdate });
    } else {
      return user;
    }
  }

  async findOneById(id: number): Promise<User> {
    const user: User | null = await User.findOne({ where: { id } });
    if (!user) throw new NotFoundError('Requested User Not Found by userName.');

    return user;
  }
}

export default new UserService();
