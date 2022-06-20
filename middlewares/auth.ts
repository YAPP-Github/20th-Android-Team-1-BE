import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, NotFoundError, UnauthorizedError } from 'routing-controllers';
import userService from '../services/user-service';
import authService from '../services/auth-service';

export class TokenValidMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const bearer = request.headers['authorization']?.split(' ')?.[0];
    const token = request.headers['authorization']?.split(' ')?.[1];
    if (bearer != 'Bearer' || !token)
      throw new UnauthorizedError('UnAuthorized : Bearer token is required.');

    console.log('?');
    await authService.validateAccessToken(token);
    response.locals.user = await authService.getInfoByAccessToken(token);
    next();
  }
}

export class UserAuthMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const bearer = request.headers['authorization']?.split(' ')?.[0];
    const token = request.headers['authorization']?.split(' ')?.[1];
    if (bearer != 'Bearer' || !token)
      throw new UnauthorizedError('UnAuthorized : Bearer token is required.');

    const userId: number = await authService.validateAccessToken(token);

    try {
      const user = await userService.updateTokenIfDiff(userId, token);

      response.locals.user = user;
      next();
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        throw new UnauthorizedError('Token from unsigned user. Please sign-up');
      }
    }
  }
}
