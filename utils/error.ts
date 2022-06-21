export class ApplicationError extends Error {
  timestamp: Date;
  status: number;
  error: string;
  exception: string;
  message: string;

  constructor(error: string, status = 500) {
    super(error);
    this.timestamp = new Date();
    this.status = status;
    this.error = error;
    this.exception = '';
    this.message = '';
  }
}

export class NotFoundException extends ApplicationError {
  constructor(model: string, id: number | string) {
    super(`id ${id} not found in ${model}`, 404);
  }
}

export class ValidationException extends ApplicationError {
  constructor(param: any) {
    super(`parameter ${param} required. please check header or body`, 400);
  }
}

export class UnAuthorizedException extends ApplicationError {
  constructor(message = 'Unauthorized request. please check the token') {
    super(message, 401);
  }
}

export class InternalServerException extends ApplicationError {
  constructor() {
    super(`internal Server error`, 500);
  }
}
