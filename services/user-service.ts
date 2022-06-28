import { NotFoundException } from '../utils/error';
import User from '../models/user';

class UserService {
  async create(id: number, userName: string, accessToken: string) {
    const user: User = new User({ id, userName, accessToken });
    return await user.save();
  }

  async updateTokenIfDiff(id: number, tokenToUpdate: string) {
    const user = await this.findOneById(id);

    if (user.accessToken != tokenToUpdate) {
      return await user.update({ accessToken: tokenToUpdate });
    } else {
      return user;
    }
  }

  async exist(id: number) {
    const exist = await User.findByPk(id);
    return exist ? true : false;
  }

  async findOneById(id: number) {
    const user: User | null = await User.findByPk(id);
    if (!user) throw new NotFoundException('User', id);
    return user;
  }
}

export default new UserService();
