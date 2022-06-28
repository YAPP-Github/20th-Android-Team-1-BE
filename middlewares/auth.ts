import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import userService from '../services/user-service';
import authService from '../services/auth-service';
import { UnAuthorizedException } from '../utils/error';

export class TokenValidMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const bearer = request.headers['authorization']?.split(' ')?.[0];
    const token = request.headers['authorization']?.split(' ')?.[1];
    if (bearer != 'Bearer' || !token) return next(new UnAuthorizedException());

    try {
      const userId = await authService.validateAccessToken(token);
      response.locals.user = await authService.getInfoByAccessToken(token, userId);
      next();
    } catch (err: any) {
      next(err);
    }
  }
}

export class UserAuthMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const bearer = request.headers['authorization']?.split(' ')?.[0];
    const token = request.headers['authorization']?.split(' ')?.[1];
    if (bearer != 'Bearer' || !token) return next(new UnAuthorizedException());

    try {
      const userId: number = await authService.validateAccessToken(token);
      const user = await userService.updateTokenIfDiff(userId, token);

      response.locals.user = user;
      next();
    } catch (err: any) {
      next(err);
    }
  }
}
