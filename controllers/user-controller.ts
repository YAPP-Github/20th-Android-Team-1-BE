import { Response } from 'express';
import { Post, JsonController, Res, Body, UseBefore } from 'routing-controllers';
import { SignUpRequest } from '../dtos/user/request';
import { UserReponse } from '../dtos/user/response';
import { AuthMiddlware } from '../middlewares/auth';
import User from '../models/user';
import UserService from '../services/user-service';

@JsonController('/users')
@UseBefore(AuthMiddlware)
class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest, @Res() response: Response) {
    const user: User = await this.userService.create(
      request.userName,
      response.locals.auth.accessToken!,
      response.locals.auth.refreshToken!
    );

    return response.status(200).send(new UserReponse(user));
  }
}

export default UserController;
