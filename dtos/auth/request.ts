import { Request } from 'express';
import { IsNotEmpty } from 'class-validator';

export class AuthRequest {
  @IsNotEmpty()
  accessToken: string;
  refreshToken?: string;

  constructor(req: Request) {
    if (req.headers['access-token']) {
      this.accessToken = req.headers['access-token'] as string;
    }
    if (req.headers['refresh-token']) {
      this.refreshToken = req.headers['refresh-token'] as string;
    }
  }
}
