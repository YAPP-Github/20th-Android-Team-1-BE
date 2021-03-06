import { Request, Response } from 'express';
import { ApplicationError } from '../utils/error';

import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response) {
    let res: ApplicationError;
    if (!(error instanceof ApplicationError)) {
      res = new ApplicationError(error.message, error.httpCode || error.status, error.errors);
    } else res = error;

    console.log(error);
    response.status(res.status).json({ ...res, message: res.message });
  }
}
