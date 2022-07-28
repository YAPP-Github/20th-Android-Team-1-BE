import { MaxLength } from 'class-validator';

export class UpdateUserRequest {
  @MaxLength(5)
  userName: string;
}
