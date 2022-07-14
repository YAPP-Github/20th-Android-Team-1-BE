import { IsInt, MaxLength } from 'class-validator';
import User from '../../models/user';

export class UserResponse {
  @IsInt()
  id: number;
  @MaxLength(5)
  userName: string;

  constructor(user: User) {
    this.id = user.id;
    this.userName = user.userName;
  }
}
