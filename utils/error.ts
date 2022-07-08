import timeUtil from './time';

export class ApplicationError extends Error {
  timestamp: string;
  status: number;
  error: string;
  exception: string;

  constructor(message: string, status = 500, error = '') {
    super(message);
    this.timestamp = timeUtil.formatDate2String(new Date());
    this.status = status;
    this.error = error;
    this.exception = '';
  }
}
export class NotFoundException extends ApplicationError {
  constructor(model: string, id: number | string) {
    super(`[NotFoundError] id ${id} not found in ${model}`, 404);
  }
}

export class ValidationException extends ApplicationError {
  constructor(param: any) {
    super(`[ValidationError] parameter ${param} required. please check header or body`, 400);
  }
}

export class BadRequestException extends ApplicationError {
  constructor(param: any, message = 'not appropriate') {
    super(`parameter ${param} ${message}.`, 400);
  }
}

export class UnAuthorizedException extends ApplicationError {
  constructor(message = '[UnAuthorizedError] Unauthorized request. please check the token') {
    super(message, 401);
  }
}

export class InternalServerException extends ApplicationError {
  constructor() {
    super(`[InternalServerError] internal Server error`, 500);
  }
}
