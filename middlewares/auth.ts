import { NextFunction, Request, Response } from 'express';
import {
  BadRequestError,
  ExpressMiddlewareInterface,
  NotFoundError,
  UnauthorizedError
} from 'routing-controllers';
import userService from '../services/user-service';
import authService from '../services/auth-service';

export class TokenValidMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const token = request.headers['authorization'];
    if (!token) throw new BadRequestError('Bad Request : AccessToken is required.');

    await authService.validateAccessToken(token);
    response.locals.accessToken = token;
    next();
  }
}

export class UserAuthMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const token = request.headers['authorization'];
    if (!token) throw new BadRequestError('Bad Request : AccessToken is required.');

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
