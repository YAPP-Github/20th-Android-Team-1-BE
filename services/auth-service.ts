import axios, { AxiosInstance } from 'axios';
import { UnauthorizedError } from 'routing-controllers';
import { KAKAOInfoResponse } from '../dtos/auth/response';
import { BadRequestException, UnAuthorizedException } from '../utils/error';

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
      console.log(response.data);
      return response.data.id;
    } catch (err: any) {
      throw new UnAuthorizedException(err.response.data.msg);
    }
  }

  async getInfoByAccessToken(token: string, userId: number): Promise<KAKAOInfoResponse> {
    try {
      const response = await this.client.get(
        `/v2/user/me?target_id_type=user_id&target_id=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(response.data);
      if (!response.data.kakao_account.name && !response.data.kakao_account.profile.nickname)
        throw new UnAuthorizedException('Kakao account name or profile nickname is required.');
      return {
        id: response.data.id,
        userName: response.data.kakao_account.name || response.data.kakao_account.profile.nickname,
        accessToken: token
      };
    } catch (err: any) {
      console.log(err);
      throw new UnAuthorizedException(err.response.data.msg);
    }
  }
}

export default new AuthService();
