import { Response } from 'express';
import { Post, JsonController, Res, UseBefore, InternalServerError } from 'routing-controllers';
import { UserReponse } from '../dtos/user/response';
import { TokenValidMiddleware } from '../middlewares/auth';
import User from '../models/user';
import userService from '../services/user-service';

@JsonController('/users')
class UserController {
  @Post('/sign-up')
  @UseBefore(TokenValidMiddleware)
  async signUp(@Res() res: Response) {
    try {
      const user: User = await userService.create(
        res.locals.user.id,
        res.locals.user.userName,
        res.locals.user.accessToken
      );

      return res.status(200).send(new UserReponse(user));
    } catch (err: any) {
      throw new InternalServerError(err);
    }
  }
}

export default UserController;
