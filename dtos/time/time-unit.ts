import { IsNotEmpty } from 'class-validator';

export default class TimeUnit {
    @IsNotEmpty()
    startTime: Date;
    @IsNotEmpty()
    endTime: Date;
}
