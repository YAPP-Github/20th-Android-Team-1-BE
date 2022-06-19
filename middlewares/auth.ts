import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { AuthRequest, ValidateTokenRequest } from '../dtos/auth/request';
import userService from '../services/user-service';

export class TokenValidMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    const tokens = new ValidateTokenRequest(request);

    response.locals.auth = tokens;
    next();
  }
}

export class UserAuthMiddleware implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction) {
    const tokens = new AuthRequest(request);

    const user = await userService.findOneByAccessToken(tokens.accessToken);
    response.locals.user = user;
    next();
  }
}
