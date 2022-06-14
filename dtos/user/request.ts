import { IsNotEmpty } from 'class-validator';

export class SignUpRequest {
  @IsNotEmpty()
  userName: string;
}
