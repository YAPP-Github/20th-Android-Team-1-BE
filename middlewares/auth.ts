import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { AuthRequest } from '../dtos/auth/request';

export class AuthMiddlware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    const credential = new AuthRequest(request);
    response.locals.auth = credential;
    next();
  }
}
