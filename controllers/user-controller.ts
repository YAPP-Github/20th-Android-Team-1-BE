import { Request, Response } from 'express';
import {
  Post,
  JsonController,
  Res,
  Body,
  UseBefore,
  InternalServerError,
  Get,
  Req
} from 'routing-controllers';
import { SignUpRequest } from '../dtos/user/request';
import { UserReponse } from '../dtos/user/response';
import { AuthMiddlware, SignUpMiddleware } from '../middlewares/auth';
import User from '../models/user';
import userService from '../services/user-service';

@JsonController('/users')
class UserController {
  @Post('/sign-up')
  @UseBefore(SignUpMiddleware)
  async signUp(@Body() req: SignUpRequest, @Res() res: Response) {
    try {
      const user: User = await userService.create(
        req.userName,
        res.locals.auth.accessToken!,
        res.locals.auth.refreshToken!
      );

      return res.status(200).send(new UserReponse(user));
    } catch (err: any) {
      throw new InternalServerError(err);
    }
  }
}

export default UserController;
