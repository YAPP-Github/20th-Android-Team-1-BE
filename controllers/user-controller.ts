import { Response } from 'express';
import { Post, JsonController, Res, UseBefore, Get } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserResponse } from '../dtos/user/response';
import { TokenValidMiddleware, UserAuthMiddleware } from '../middlewares/auth';
import User from '../models/user';
import userService from '../services/user-service';
import { BadRequestException } from '../utils/error';
import { UserAuthMiddleware } from '../middlewares/auth';

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/users')
class UserController {
  @OpenAPI({ summary: 'Sign up User with KAKAO Access Token.' })
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
  
  @OpenAPI({ summary: 'delete member by userId' })
  @Post('/resign-member')
  @UseBefore(UserAuthMiddleware)
  async reSignMember(@Res() res:Response) {
    const exist = await userService.exist(res.locals.user.id);
    if (!exist) throw new BadRequestException('User', 'already removed.');
    await userService.delete(res.locals.user.id);
    return res.sendStatus(200);
 }

  @OpenAPI({ summary: "Get User's information" })
  @ResponseSchema(UserResponse)
  @Get('/info')
  @UseBefore(UserAuthMiddleware)
  async getUserInfo(@Res() res: Response) {
    const response = new UserResponse(res.locals.user);
    res.status(200).send(response);
  }
}

export default UserController;
