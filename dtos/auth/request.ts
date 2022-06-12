import { Request } from 'express';

export class AuthRequest {
  accessToken?: string;
  refreshToken?: string;

  constructor(req: Request) {
    this.accessToken = req.headers['access-token'] as string;
    this.refreshToken = req.headers['refresh-token'] as string;
  }
}
