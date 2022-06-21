import { NotFoundException } from '../utils/error';
import User from '../models/user';

class UserService {
  async create(id: number, userName: string, accessToken: string): Promise<User> {
    const user: User = new User({ id, userName, accessToken });
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
    if (!user) throw new NotFoundException('User', id);
    return user;
  }
}

export default new UserService();
