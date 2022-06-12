import User from '../../models/user';

export class UserReponse {
  id: number;
  userName: string;

  constructor(user: User) {
    this.id = user.id;
    this.userName = user.userName;
  }
}
