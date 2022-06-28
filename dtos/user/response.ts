import User from '../../models/user';

export class UserResponse {
  id: number;
  userName: string;

  constructor(user: User) {
    this.id = user.id;
    this.userName = user.userName;
  }
}
