import { IsNotEmpty } from 'class-validator';

export default class Time {
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    times: Array<boolean>;
}
