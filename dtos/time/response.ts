import { IsNotEmpty } from 'class-validator';

export default class TimeResponse {
  @IsNotEmpty()
  startTime: Date;
  @IsNotEmpty()
  endTime: Date;
}
