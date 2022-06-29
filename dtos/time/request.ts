import { IsNotEmpty } from 'class-validator';

class TimeRequest {
    @IsNotEmpty()
    unit: number;
    @IsNotEmpty()
    timeTable: Array<TimeOfDay>;
}

class TimeOfDay {
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    times: Array<boolean>;
}

export { TimeRequest, TimeOfDay }