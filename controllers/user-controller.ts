import { Response } from 'express';
import { Post, JsonController, Res, UseBefore, Get, Body } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UpdateUserRequest } from '../dtos/user/request';
import { UserResponse } from '../dtos/user/response';
import { TokenValidMiddleware, UserAuthMiddleware } from '../middlewares/auth';
import User from '../models/user';
import userService from '../services/user-service';
import { BadRequestException } from '../utils/error';

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/users')
class UserController {
  @OpenAPI({ summary: 'Sign up User with KAKAO Access token.' })
  @ResponseSchema(UserResponse)
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

    return res.status(200).send(new UserResponse(user));
  }

  @OpenAPI({ summary: 'Delete User' })
  @Post('/resign-member')
  @UseBefore(UserAuthMiddleware)
  async reSignMember(@Res() res: Response) {
    const exist = await userService.exist(res.locals.user.id);
    if (!exist) throw new BadRequestException('User', 'already removed.');
    await userService.delete(res.locals.user.id);
    return res.sendStatus(200);
  }

  @OpenAPI({ summary: "Update User's name" })
  @ResponseSchema(UserResponse)
  @Post('/name')
  @UseBefore(UserAuthMiddleware)
  async updateUserName(@Body() req: UpdateUserRequest, @Res() res: Response) {
    const user = await userService.update(res.locals.user, req.userName);
    const response = new UserResponse(user);
    return res.status(200).send(response);
  }

  @OpenAPI({ summary: "Get User's information" })
  @ResponseSchema(UserResponse)
  @Get('/info')
  @UseBefore(UserAuthMiddleware)
  async getUserInfo(@Res() res: Response) {
    const response = new UserResponse(res.locals.user);
    return res.status(200).send(response);
  }
}

export default UserController;
