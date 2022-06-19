import { Request } from 'express';
import { IsNotEmpty } from 'class-validator';

export class AuthRequest {
  @IsNotEmpty()
  accessToken: string;

  constructor(req: Request) {
    if (req.headers['access-token']) {
      this.accessToken = req.headers['access-token'] as string;
    }
  }
}

export class ValidateTokenRequest extends AuthRequest {
  @IsNotEmpty()
  refreshToken: string;

  constructor(req: Request) {
    super(req);

    if (req.headers['refresh-token']) {
      this.refreshToken = req.headers['refresh-token'] as string;
    }
  }
}
