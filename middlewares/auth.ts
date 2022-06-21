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
      await authService.validateAccessToken(token);
      response.locals.user = await authService.getInfoByAccessToken(token);
      next();
    } catch (err: any) {
      console.log('i catch');
      next(err);
    }
  }
}

export class UserAuthMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const bearer = request.headers['authorization']?.split(' ')?.[0];
    const token = request.headers['authorization']?.split(' ')?.[1];
    if (bearer != 'Bearer' || !token) return next(new UnAuthorizedException());

    const userId: number = await authService.validateAccessToken(token);

    try {
      const user = await userService.updateTokenIfDiff(userId, token);

      response.locals.user = user;
      next();
    } catch (err: any) {
      next(err);
    }
  }
}
