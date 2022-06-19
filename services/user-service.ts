import { NotFoundError } from 'routing-controllers';
import User from '../models/user';

class UserService {
  async create(userName: string, accessToken: string, refreshToken: string): Promise<User> {
    const user: User = new User({ userName, accessToken, refreshToken });
    return await user.save();
  }

  async updateAccessToken(refreshToken: string, accessTokenToUpdate: string) {
    const user = await this.findOneByRefreshToken(refreshToken);

    await user.update({ accessToken: accessTokenToUpdate });
  }

  async updateRefreshToken(
    userName: string,
    accessTokenToUpdate: string,
    refreshTokenToUpdate: string
  ) {
    const user = await this.findOneByUserName(userName);

    await user.update({ accessToken: accessTokenToUpdate, refreshToken: refreshTokenToUpdate });
  }

  async findOneByUserName(userName: string) {
    const user: User | null = await User.findOne({ where: { userName } });
    if (!user) throw new NotFoundError('Requested User Not Found by userName.');

    return user;
  }

  async findOneByAccessToken(accessToken: string): Promise<User> {
    const user: User | null = await User.findOne({ where: { accessToken } });
    if (!user)
      throw new NotFoundError(
        'Requested User Not Found by accessToken. Sign-up or Update accessToken.'
      );

    return user;
  }

  async findOneByRefreshToken(refreshToken: string) {
    const user: User | null = await User.findOne({ where: { refreshToken } });
    if (!user)
      throw new NotFoundError(
        'Requested User Not Found by refreshToken. Sign-up or Update refreshToken.'
      );

    return user;
  }
}

export default new UserService();
