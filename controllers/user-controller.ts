import { NextFunction, Response } from 'express';
import { Post, JsonController, Res, UseBefore, Get, QueryParam } from 'routing-controllers';
import { UserReponse } from '../dtos/user/response';
import { TokenValidMiddleware } from '../middlewares/auth';
import User from '../models/user';
import userService from '../services/user-service';
import { BadRequestException } from '../utils/error';

@JsonController('/users')
class UserController {
  @Post('/sign-up')
  @UseBefore(TokenValidMiddleware)
  async signUp(@Res() res: Response) {
    const exist = await userService.exist(res.locals.user.id);
    if (exist) throw new BadRequestException('User', 'already exist.');

    const user: User = await userService.create(
      res.locals.user.id,
      res.locals.user.userName,
      res.locals.user.accessToken
    );

    return res.status(200).send(new UserReponse(user));
  }

  @Get('/test')
  test(@QueryParam('code') code: string, @Res() res: Response) {
    console.log(code);
    res.send('ok');
  }
}

export default UserController;
