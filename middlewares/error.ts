import { Request, Response } from 'express';
import { ApplicationError } from '../utils/error';

import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response) {
    let res: ApplicationError;
    if (!(error instanceof ApplicationError)) {
      res = new ApplicationError(error.message, error.status);
    } else res = error;

    response.status(res.status).json(res);
  }
}
