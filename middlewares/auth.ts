import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import { AuthRequest } from '../dtos/auth/request';
import userService from '../services/user-service';

export class SignUpMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    const tokens = new AuthRequest(request);
    if (!tokens.accessToken) {
      throw new UnauthorizedError('accessToken required. please check headers');
    }
    if (!tokens.refreshToken) {
      throw new UnauthorizedError('refreshToken required. please check headers');
    }

    response.locals.auth = tokens;
    next();
  }
}

export class AuthMiddlware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const tokens = new AuthRequest(request);
    if (!tokens.accessToken) {
      throw new UnauthorizedError('accessToken required. please check headers');
    }

    const user = await userService.findOneByAccessToken(tokens.accessToken);
    response.locals.user = user;
    next();
  }
}
