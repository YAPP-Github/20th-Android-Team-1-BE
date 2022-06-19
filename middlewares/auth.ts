import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { AuthRequest } from '../dtos/auth/request';
import userService from '../services/user-service';
import { validationException } from '../utils/error';

export class SignUpMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    const tokens = new AuthRequest(request);
    if (!tokens.accessToken) {
      throw new validationException('accessToken');
    }
    if (!tokens.refreshToken) {
      throw new validationException('refreshToken');
    }

    response.locals.auth = tokens;
    next();
  }
}

export class AuthMiddlware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const tokens = new AuthRequest(request);
    if (!tokens.accessToken) {
      throw new validationException('accessToken');
    }

    const user = await userService.findOneByAccessToken(tokens.accessToken);
    response.locals.user = user;
    next();
  }
}
