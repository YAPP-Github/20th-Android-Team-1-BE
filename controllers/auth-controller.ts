import { Response } from 'express';
import {
  Body,
  InternalServerError,
  JsonController,
  Post,
  Res,
  UseBefore
} from 'routing-controllers';
import { SignUpRequest } from '../dtos/user/request';
import { TokenValidMiddleware } from '../middlewares/auth';
import userService from '../services/user-service';

@JsonController('/auth')
class AuthController {
  @Post('/access-token')
  @UseBefore(TokenValidMiddleware)
  async renewAccessToken(@Res() res: Response) {
    try {
      await userService.updateAccessToken(res.locals.refreshToken!, res.locals.accessToken!);
      return res.status(204).send();
    } catch (err: any) {
      throw new InternalServerError(err);
    }
  }

  @Post('/refresh-token')
  @UseBefore(TokenValidMiddleware)
  async renewRefreshToken(@Body() req: SignUpRequest, @Res() res: Response) {
    try {
      await userService.updateRefreshToken(
        req.userName,
        res.locals.accessToken,
        res.locals.refreshToken
      );
      return res.status(204).send();
    } catch (err: any) {
      throw new InternalServerError(err);
    }
  }
}

export default AuthController;
