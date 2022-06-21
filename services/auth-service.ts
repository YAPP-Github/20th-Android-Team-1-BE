import axios, { AxiosInstance } from 'axios';
import { KAKAOInfoResponse } from '../dtos/auth/response';
import { UnAuthorizedException } from '../utils/error';

class AuthService {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://kapi.kakao.com'
    });
  }

  async validateAccessToken(token: string): Promise<number> {
    try {
      const response = await this.client.get('/v1/user/access_token_info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.id;
    } catch (err: any) {
      throw new UnAuthorizedException(err.response.data.msg);
    }
  }

  async getInfoByAccessToken(token: string): Promise<KAKAOInfoResponse> {
    try {
      const response = await this.client.get('/v2/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return {
        id: response.data.id,
        userName: response.data.kakao_account.name,
        accessToken: token
      };
    } catch (err: any) {
      throw new UnAuthorizedException(err.response.data.msg);
    }
  }
}

export default new AuthService();
